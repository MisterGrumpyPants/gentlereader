define([],function(){var e;return e=function(e){var i,t,a,r,n;if(e&&e.hasOwnProperty("query")){for(t=[],n=e.query,a=0,r=n.length;r>a;a++)i=n[a],t.push(""+i+"="+e.query[i]);return"?"+t.join("&")}return""}});