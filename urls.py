from django.conf.urls.defaults import *
from django.http import HttpResponse
from django.contrib import admin
from gentlereader.feeds import FullFeed
from gentlereader.sitemap import SelectionSitemap, AnnouncementSitemap, AuthorSitemap, TagSitemap, QuotationSitemap
admin.autodiscover()

# Data Access URLs
urlpatterns = patterns('gentlereader.api',
    (r'^api/selections/$', 'selection_set'),
    (r'^api/selections/(?P<selectionId>\d+)/$', 'selection'),
    (r'^api/selections/(?P<selectionId>\d+)/(?P<attribute>source|genres|contexts|topics|styles|quotations)/$', 'selection_attribute_set'),
    (r'^api/selections/(?P<selectionId>\d+)/(?P<attribute>source|genres|contexts|topics|styles|quotations)/(?P<attributeId>\d+)/$', 'selection_attribute'),
    (r'^api/selections/(?P<selectionId>\d+)/source/(?P<sourceId>\d+)/(?P<attribute>language|forms|author)/$', 'source_attribute_set'),
    (r'^api/selections/(?P<selectionId>\d+)/source/(?P<sourceId>\d+)/(?P<attribute>language|forms|author)/(?P<attributeId>\d+)/$', 'source_attribute'),
    (r'^api/selections/(?P<selectionId>\d+)/source/(?P<sourceId>\d+)/author/(?P<authorId>\d+)/(?P<attribute>nations)/$', 'author_attribute_set'),
    (r'^api/selections/(?P<selectionId>\d+)/source/(?P<sourceId>\d+)/author/(?P<authorId>\d+)/(?P<attribute>nations)/(?P<attributeId>\d+)/$', 'author_attribute'),
    (r'^api/quotations/$', 'quotation_all'),
    (r'^api/quotations/(?P<quotationId>\d+|random)/$', 'quotation'),
    (r'^api/sources/$', 'source_set'),
    (r'^api/authors/$', 'author_all'),
    (r'^api/authors/(?P<authorSlug>[\w-]+)/quotations', 'author_quotations'),
    (r'^api/recent/$', 'recent_contents'),
    (r'^api/recent/selections/$', 'recent_selections'),
    (r'^api/recent/announcements/$', 'recent_announcements'),

    #tag pages -- maybe later can figure out a way to consolidate this code?
    (r'^api/nations/$', 'nation_set'),
    (r'^api/languages/$', 'language_set'),
    (r'^api/forms/$', 'form_set'),
    (r'^api/genres/$', 'genre_set'),
    (r'^api/contexts/$', 'context_set'),
    (r'^api/topics/$', 'topic_set'),
    (r'^api/styles/$', 'style_set'),

    (r'api/search/authors', 'author_search_data'),
    (r'api/search/selections', 'selection_search_data'),
    (r'api/search/nations', 'nation_search_data'),
    (r'api/search/languages', 'language_search_data'),
    (r'api/search/forms', 'form_search_data'),
    (r'api/search/genres', 'genre_search_data'),
    (r'api/search/contexts', 'context_search_data'),
    (r'api/search/topics', 'topic_search_data')
)

sitemaps = {
    'selection': SelectionSitemap,
    'announcement': AnnouncementSitemap,
    'author': AuthorSitemap,
    'tag': TagSitemap,
    'highlight': QuotationSitemap
}

urlpatterns += patterns('django.contrib.sitemaps.views',
    (r'^sitemap\.xml$', 'index', {'sitemaps': sitemaps}),
    (r'^sitemap-(?P<section>.+)\.xml$', 'sitemap', {'sitemaps': sitemaps}),
)

urlpatterns += patterns('',
    (r'^feed/$', FullFeed())
)

robots = ("User-agent: *\n"
          "Sitemap: http://www.thegentlereader.net/sitemap.xml\n"
          "Disallow: /search/\n"
          "Disallow: /api/\n"
          "Disallow: /feed/")

urlpatterns += patterns('gentlereader.views',
    (r'^$', 'home'),
    (r'^robots\.txt$', lambda r: HttpResponse(robots, mimetype="text/plain")),
    (r'^about/$', 'about'),
    (r'^selections/$', 'browse_selections'),
    (r'^selections/(?P<sel_slug>[\w-]+)/$', 'selection'),
    (r'^announcements/$', 'browse_announcements'),
    (r'^announcements/(?P<ann_slug>[\w-]+)/$', 'announcement'),
    (r'^timeline/$', 'browse_timeline'),
    (r'^search', 'search_results'),
    #(r'^resources/$', 'resource'),
    (r'^contact/$', 'contact'),
    (r'^contact/thanks/$', 'thanks'),
    (r'^highlights/$', 'browse_highlights'),
    (r'^highlights/random/$', 'highlight_random'),
    (r'^highlights/(?P<highlight_id>\d+)/$', 'highlight'),
    (r'^(?P<tag_type>[\w-]+)/(?P<tag_slug>[\w-]+)/$', 'tag'),
    (r'^(?P<category>[\w-]+)/$', 'browse_category'),
)
