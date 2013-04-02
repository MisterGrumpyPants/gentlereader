from django.shortcuts import render_to_response, redirect
from anthologist.models import Selection, Author, Topic, Nation, Language, Form, Genre, Context, Topic, Style, Tag, ExternalLink, ExternalLinkCategory, Announcement, Quotation
from django.template import RequestContext
import json
from django.shortcuts import get_object_or_404
from anthologist.forms import ContactForm
from django.core.mail import EmailMessage
from django.http import HttpResponseRedirect
from utils import ignore_articles, dumb_to_smart_quotes

#utility
def _get_selection_tags(s):
    
    """ Takes a selection (s) and returns a dictionary with
    all of the selection's tags, organized by category and sorted """

    # establish the desired tag categories
    tag_type_list = [ 'forms', 'genres', 'topics', 'contexts', 'nations' ]
    # setup the dictionary, each item being an object with a designated 'type' and a list of tags
    grouped_tags = [ { 'type': tag_type, 'tags': [ ] } for tag_type in tag_type_list ]
    # get and sort the tags for each category
    for it in grouped_tags:
        this_type = it['type']
        if this_type == 'forms':
            it['tags'] = getattr(s.source, this_type).all()
        elif this_type == 'nations':
            it['tags'] = getattr(s.source.author, this_type).all()
        else:
            it['tags'] = getattr(s, this_type).all()
        # sort the tag-list, using ignore_articles()
        it['tags'] = sorted(it['tags'], key=lambda tag: ignore_articles(tag.name))
    
    return grouped_tags


def selection(req, sel_slug):
    
    # 'most recent' and 'random' will redirect to an actual selection's slug
    if sel_slug == 'most-recent' or sel_slug == 'random':
        if sel_slug == 'most-recent':
            selection = Selection.objects.latest('date_entered')
        elif sel_slug == 'random':
            selection = Selection.objects.order_by('?')[0] 
        url = '/selections/' + selection.slug
        return redirect(url)   
    
    # get the selection
    else:
        selection = get_object_or_404(Selection, slug=sel_slug)
        
    # get the selection's tags
    grouped_tags = _get_selection_tags(selection)
    
    # get a random quotation to display as the highlight
    quotation = Quotation.objects.filter(selection=selection).order_by('?')[0]
    
    return render_to_response('selection.html', {
            'selection': selection,
            'source': selection.source,
            'grouped_tags': grouped_tags,
            'quotation': quotation
        }, context_instance=RequestContext(req))
    

def tag(req, tag_type, tag_slug):
    # tag_type is going to come with a plural-s on the end
    ftt = [ 'author', 'forms', 'genres', 'topics', 'contexts', 'styles', 'nations', 'language'  ]
    if tag_type == 'forms':
        ftt.remove('forms')
    elif tag_type == 'languages':
        ftt.remove('language')
    tag_type = tag_type[:-1] #subtract the "s"
    if tag_type == 'author':
        tag = get_object_or_404(Author, slug=tag_slug)
        tag_type_json = json.dumps(tag_type)
        all_selections = Selection.objects.filter(source__author=tag)
    else:
        tag = get_object_or_404(Tag, slug=tag_slug)
        # tag_type returns an integer; so get_tag_type_display() is necessary
        tag_type_json = json.dumps(tag.get_tag_type_display())
        #related_tags = Tag.objects.filter(tag_type=tag.tag_type) #order_by('name') is default in models.py
        if tag_type == 'language':
            all_selections = Selection.objects.filter(source__language=tag)
        elif tag_type == 'form':
            all_selections = Selection.objects.filter(source__forms=tag)
        elif tag_type == 'nation':
            all_selections = Selection.objects.filter(source__author__nations=tag)
        else:
            x = str(tag.get_tag_type_display()) + 's'
            kwargs = { x: tag }
            all_selections = Selection.objects.filter(**kwargs)

    return render_to_response('tag.jade', {
            'tag_type': tag_type,
            'tag': tag,
            'tag_type_json': tag_type_json,
            #'related_tags': related_tags,
            'all_selections': all_selections,
            'filter_tag_types': ftt
        }, context_instance=RequestContext(req))

category_array = [ 'selections', 'authors', 'highlights', 'timeline', 'forms', 'genres', 'topics', 'contexts', 'styles', 'nations', 'languages', ]

def category(req, category):
    #this "exec" business necessary to use variable as model name in query
    code = 'tags = ' + str(category.capitalize()[:-1] + '.objects.all()')
    exec code
    
    #Only accept tags that are active -- that is, attached to a relevant model (author to source, nation to author, etc.)
    filtered_tags = [ t for t in tags if t.is_active() ]
    return render_to_response('browse.jade', {
        'category': category,
        'category_json': json.dumps(category),
        'category_array': category_array,
        'tags': filtered_tags
    }, context_instance=RequestContext(req))

def all_selections(req):
    return render_to_response('browse.jade', {
        'category': 'selections',
        'category_array': category_array,
        'all_selections': Selection.objects.all().order_by('-date_entered')
    }, context_instance=RequestContext(req))

def home(req):
    s = Selection.objects.all()
    a = Announcement.objects.all()
    recent_content = sorted(set(s).union(a), key=lambda item: item.date_entered, reverse=True)[:10]
    selections_only = Selection.objects.all()[:10]
    announcements_only = Announcement.objects.all()[:10]
    return render_to_response('home.jade', {
        'recent_content': recent_content,
        'selections_only': selections_only,
        'announcements_only': announcements_only
    }, context_instance=RequestContext(req))

def timeline(req):
    return render_to_response('browse.jade', {
        'category': 'timeline',
        'category_array': category_array,
        'all_selections': Selection.objects.all().order_by('source__pub_year')
    }, context_instance=RequestContext(req))

def resource(req):
    link_categories = ExternalLinkCategory.objects.all()
    return render_to_response('resource.jade', {
        'link_categories': link_categories
    }, context_instance=RequestContext(req))

def all_announcements(req):
    announcements = Announcement.objects.all()
    return render_to_response('browse.jade', {
        'category': 'announcements',
        'announcements': announcements
    }, context_instance=RequestContext(req))

def announcement(req, ann_slug):
    ann = get_object_or_404(Announcement, slug=ann_slug)
    return render_to_response('announcement.jade', { 'ann': ann }, context_instance=RequestContext(req)) 

def contribute(req):
    auto_subject = req.GET.get('subject')
    
    if req.method == 'POST': # If the form has been submitted...
        form = ContactForm(req.POST) # A form bound to the POST data
        if form.is_valid(): # All validation rules pass
            subject = form.cleaned_data['subject']
            message = '(From ' + form.cleaned_data['sender'] + ') ' + form.cleaned_data['message']
            sender = form.cleaned_data['sender']
            cc_myself = form.cleaned_data['cc_myself']
            recipients = [ 'dave@projectegghead.com' ]
            if cc_myself:
                recipients.append(sender)
            from django.core.mail import send_mail
            send_mail(subject, message, sender, recipients)
            return HttpResponseRedirect('/thanks/') # Redirect after POST
    else:
        form = ContactForm() # An unbound form'
    return render_to_response('contribute.html', { 'form': form, 'auto_subject': auto_subject }, context_instance=RequestContext(req))
  
def thanks(req):
    return render_to_response('contribute.html', { 'thanks': 'thanks' }, context_instance=RequestContext(req))

def browse(req):
    return render_to_response('browse-base.jade', context_instance=RequestContext(req))

def browse_highlights(req):
    return render_to_response('browse.jade', {
        'category': 'highlights',
        'category_json': json.dumps('highlights'),
        'category_array': category_array
    }, context_instance=RequestContext(req))

def highlight(req, q_id):
    if q_id == 'random':
        quotation = Quotation.objects.order_by('?')[0]
        url = '/highlights/' + str(quotation.pk)
        return redirect(url)   
    else:
        quotation = get_object_or_404(Quotation, pk=q_id)
    text = dumb_to_smart_quotes(str(quotation.quotation))
    return render_to_response('highlight.jade', {
        'quotation': quotation,
        'text': text
    }, context_instance=RequestContext(req))