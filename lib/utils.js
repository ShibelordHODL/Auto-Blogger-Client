/* eslint import/prefer-default-export: 0  */
import sanitizeHtml from 'sanitize-html';
import fetch from 'isomorphic-unfetch';
import initApollo from './init-apollo';
import gql from 'graphql-tag';
import FormData from 'form-data';

const sanitizeConfigs: Object = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'p',
    'a',
    'ul',
    'ol',
    'nl',
    'li',
    'b',
    'i',
    'strong',
    'em',
    'strike',
    'code',
    'hr',
    'br',
    'div',
    'table',
    'thead',
    'caption',
    'tbody',
    'tr',
    'th',
    'td',
    'pre',
    'title',
    'img',
    'html',
    'head',
    'meta',
    'body',
    'figure',
    'article',
    // 'link',
    // 'nav',
    // 'span',
    // 'div'


  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    // We don't currently allow img itself by default, but this
    // would make sense if we did
    img: ['src', 'alt'],
    meta: ['*'],
    // link: ['*'],
    article: ['*'],
    figure: ['*'],
    // span: ['class'],
    // div: ['class']
  },
  // Lots of these won't come up by default because we don't allow them
  // selfClosing: ['br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
  // URL schemes we permit
  allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
  allowedSchemesByTag: {},
  allowProtocolRelative: true,
};

export function cleanPageHTML(d) {
  const c = sanitizeHtml(d, (sanitizeConfigs: Object));
  return c;
}

export async function loadHTML(url) {
  try {
    const response = await fetch(url, { credentials: 'include' });
    const data = await response.text();
    return data;
  } catch (e) {
    return 'Booo';
  }
}

export function HtmlToBBCode(html) {
  html = html.replace(/<pre(.*?)>(.*?)<\/pre>/gim, '[code]$2[/code]');

  html = html.replace(/<h[1-7](.*?)>(.*?)<\/h[1-7]>/, '\n[h]$2[/h]\n');

  // paragraph handling:
  // - if a paragraph opens on the same line as another one closes, insert an extra blank line
  // - opening tag becomes two line breaks
  // - closing tags are just removed
  // html += html.replace(/<\/p><p/<\/p>\n<p/gi;
  // html += html.replace(/<p[^>]*>/\n\n/gi;
  // html += html.replace(/<\/p>//gi;

  html = html.replace(/<br(.*?)>/gi, '\n');
  html = html.replace(
    /<textarea(.*?)>(.*?)<\/textarea>/gim,
    '<textarea>[code] $2 [/code]</textarea>',
  );
  html = html.replace(/<b>/gi, '[b]');
  html = html.replace(/<i>/gi, '[i]');
  html = html.replace(/<u>/gi, '[u]');
  html = html.replace(/<\/b>/gi, '[/b]');
  html = html.replace(/<\/i>/gi, '[/i]');
  html = html.replace(/<\/u>/gi, '[/u]');
  html = html.replace(/<em>/gi, '[b]');
  html = html.replace(/<\/em>/gi, '[/b]');
  html = html.replace(/<strong>/gi, '[b]');
  html = html.replace(/<\/strong>/gi, '[/b]');

  html = html.replace(/<p>/gi, '[p]');
  html = html.replace(/<\/p>/gi, '[/p]');
  html = html.replace(/<h([1-6].*?)>(.*?)<\/h[1-6]>/gim, '[h$1] $2 [/h$1]');

  html = html.replace(/<\/strong>/gi, '[/b]');
  html = html.replace(/<cite>/gi, '[i]');
  html = html.replace(/<\/cite>/gi, '[/i]');
  // html = html.replace(/<font color="(.*?)">(.*?)<\/font>/gim, '[color=$1]$2[/color]');
  // html = html.replace(/<font color=(.*?)>(.*?)<\/font>/gim, '[color=$1]$2[/color]');
  html = html.replace(/<link(.*?)>/gi, '');
  html = html.replace(/<li(.*?)>(.*?)<\/li>/gi, '[*] $2');
  html = html.replace(/<ul(.*?)>/gi, '[list]');
  html = html.replace(/<\/ul>/gi, '[/list]');
  html = html.replace(/<div>/gi, '<div>');
  html = html.replace(/<\/div>/gi, '</div>');
  html = html.replace(/<td(.*?)>/gi, ' ');
  html = html.replace(/<tr(.*?)>/gi, '\n');

  html = html.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, ' [img] $2 [/img]');

  html = html.replace(/<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi, '[url] $4 [/url]');

  // html = html.replace(/<head>(.*?)<\/head>/gim, '[head] $1 [/head]');
  html = html.replace(/<object>(.*?)<\/object>/gim, '[object] $1 [/object]');
  html = html.replace(/<script(.*?)>(.*?)<\/script>/gim, '');
  html = html.replace(/<style(.*?)>(.*?)<\/style>/gim, '');
  // html = html.replace(/<title>(.*?)<\/title>/gim, '[title]$1[/title]');
  html = html.replace(/<!--(.*?)-->/gim, '\n');

  html = html.replace(/\/\//gi, '/');
  html = html.replace(/http:\//gi, 'http://');

  // html = html.replace(/<(?:[^>'"]*|(['"]).*?\1)*>/gim, '');
  html = html.replace(/\r\r/gi, '');
  html = html.replace(/\[img]\//gi, '[img]');
  html = html.replace(/\[url=\//gi, '[url=');

  html = html.replace(/(\S)\n/gi, '$1 ');

  return html;
}
export async function reverseTextToHTML(html, article) {
  let cleanArticle = removeAllSpecialCharacter(article);
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  const articleArea = $('p').parent()
  $(articleArea).find('*').each(function (i, elem) {
    let content = removeAllSpecialCharacter($(elem).text());
    if (cleanArticle.indexOf(content) > 0 & content.length > 3) {
      console.log($(elem).get(0).attribs)
      const tag = $(elem).get(0).tagName
      let atts = ' ';
      console.log($(elem).get(0).attribs.entries())
      Object.entries($(elem).get(0).attribs).forEach(([key, value]) => {
        atts += `${key}="${value}" `;
      });
      console.log(atts)
      cleanArticle = cleanArticle.replace(content, `<${tag}${atts ? atts : ''}>${content}</${tag}>`)
    }
  });
  return cleanArticle
}

function removeAllSpecialCharacter(text) {
  text = text.replace(/\s\s+/g, ' ');
  text = text.replace(/\n/g, " ");
  text = text.replace('\t', ' ');
  text = text.replace(/\s+/g, ' ');
  return text
}

export async function postArticle(articleId, siteId) {
  // fetch data from id
  const data = await getJobAndSite(articleId, siteId)
  // console.log(data);
  const article = data.Article
  const site = data.Site
  // Upload Image
  const imageUploadData = await uploadImage(site, article)
  // // Post Article to Site
  const articleData = await uploadArticle(site, imageUploadData.id, article)
  console.log(articleData);

  // Mark Article as Published
}
async function getJobAndSite(articleId, siteId) {
  const apollo = initApollo();
  const query = gql`
    query getJob($articleId: ID!, $siteId: ID!) {
      Article(id: $articleId) {
        id
        title
        article
        excerpt
        categories{
          id
          name
        }
        keywords{
          id
          keyword
        }
        images{
          source
        }

      }
      Site(id: $siteId) {
        id
        mediaapi
        postapi
        token
      }
    }
  `;

  return apollo.query({ query, variables: { articleId, siteId } })
    .then(r => r.data)
    .catch(error => console.error(error));

}

async function downloadImage(url) {
  return await fetch(url)
    .then(r => r.buffer())
}

async function uploadImage(site, article) {
  const imageURL = article.images[0].source
  const imageName = article.title + imageURL.substr(imageURL.lastIndexOf('.'))
  const imageBuffer = await downloadImage(article.images[0].source)

  const headers = {
    authorization: 'Bearer ' + site.token,
    // "Content-Disposition": `attachment; filename="upload.jpg"`
  };

  const data = new FormData();
  data.append("title", article.title);
  data.append("alt_text", article.title);
  data.append("caption", article.title);
  data.append("description", article.title);
  data.append("file", imageBuffer, imageName);
  const response = await fetch(site.mediaapi, {
    method: "POST",
    credentials: 'include',
    headers,
    body: data
  }).then(r => r.json());

  return response
}

async function uploadArticle(site, imageId, article) {

  const headers = {
    authorization: 'Bearer ' + site.token,
  };

  const data = new FormData();
  data.append("title", article.title);
  data.append("content", article.article);
  data.append("featured_media", imageId);
  data.append("status", "publish");
  data.append("tag", "[]");
  data.append("categories", 331135, 1833868);
  const response = await fetch(site.postapi, {
    method: "POST",
    credentials: 'include',
    headers,
    body: data
  }).then(r => r.json());

  return response
}

