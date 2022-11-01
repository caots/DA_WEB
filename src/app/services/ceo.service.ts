import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { CEO_TAG_CONFIG } from 'src/app/constants/config';

@Injectable({
  providedIn: 'root'
})

export class CeoService {
  private metaTagOfPage = [
    {
      page: '',
      listTag: [
        {
          name: 'title',
          content: CEO_TAG_CONFIG.LADING_PAGE_JOBSEEKER.TITLE
        },
        {
          name: 'description',
          content: CEO_TAG_CONFIG.LADING_PAGE_JOBSEEKER.DESCRIPTION
        },
        {
          name: 'image',
          content: CEO_TAG_CONFIG.LADING_PAGE_JOBSEEKER.IMAGE
        }
      ]
    },
    {
      page: '/landing-jobseeker',
      listTag: [
        {
          name: 'title',
          content: CEO_TAG_CONFIG.LADING_PAGE_JOBSEEKER.TITLE
        },
        {
          name: 'description',
          content: CEO_TAG_CONFIG.LADING_PAGE_JOBSEEKER.DESCRIPTION
        },
        {
          name: 'image',
          content: CEO_TAG_CONFIG.LADING_PAGE_JOBSEEKER.IMAGE
        }
      ]
    },
    {
      page: '/landing-employer',
      listTag: [
        {
          name: 'title',
          content: CEO_TAG_CONFIG.LADING_PAGE_EMPLOYER.TITLE
        },
        {
          name: 'description',
          content: CEO_TAG_CONFIG.LADING_PAGE_EMPLOYER.DESCRIPTION
        },
        {
          name: 'image',
          content: CEO_TAG_CONFIG.LADING_PAGE_EMPLOYER.IMAGE
        }
      ]
    },
    {
      page: '/login',
      listTag: [
        {
          name: 'title',
          content: CEO_TAG_CONFIG.SIGNIN.TITLE
        },
        {
          name: 'description',
          content: CEO_TAG_CONFIG.SIGNIN.DESCRIPTION
        },
        {
          name: 'image',
          content: CEO_TAG_CONFIG.SIGNIN.IMAGE
        }
      ]
    },
    {
      page: '/register',
      listTag: [
        {
          name: 'title',
          content: CEO_TAG_CONFIG.LADING_PAGE_JOBSEEKER.TITLE
        },
        {
          name: 'description',
          content: CEO_TAG_CONFIG.LADING_PAGE_JOBSEEKER.DESCRIPTION
        },
        {
          name: 'image',
          content: CEO_TAG_CONFIG.LADING_PAGE_JOBSEEKER.IMAGE
        }
      ]
    },
    {
      page: '/contact',
      listTag: [
        {
          name: 'title',
          content: CEO_TAG_CONFIG.CONTACT.TITLE
        },
        {
          name: 'description',
          content: CEO_TAG_CONFIG.CONTACT.DESCRIPTION
        },
        {
          name: 'image',
          content: CEO_TAG_CONFIG.CONTACT.IMAGE
        }
      ]
    },
    {
      page: '/terms-of-service',
      listTag: [
        {
          name: 'title',
          content: CEO_TAG_CONFIG.TERM_OF_SERVICE.TITLE
        },
        {
          name: 'description',
          content: CEO_TAG_CONFIG.TERM_OF_SERVICE.DESCRIPTION
        },
        {
          name: 'image',
          content: CEO_TAG_CONFIG.TERM_OF_SERVICE.IMAGE
        }
      ]
    },
    {
      page: '/privacy-policy',
      listTag: [
        {
          name: 'title',
          content: CEO_TAG_CONFIG.PRIVACY_POLICY.TITLE
        },
        {
          name: 'description',
          content: CEO_TAG_CONFIG.PRIVACY_POLICY.DESCRIPTION
        },
        {
          name: 'image',
          content: CEO_TAG_CONFIG.PRIVACY_POLICY.IMAGE
        }
      ]
    },
    {
      page: '/user-story',
      listTag: [
        {
          name: 'title',
          content: CEO_TAG_CONFIG.REPORT_STORY.TITLE
        },
        {
          name: 'description',
          content: CEO_TAG_CONFIG.REPORT_STORY.DESCRIPTION
        },
        {
          name: 'image',
          content: CEO_TAG_CONFIG.REPORT_STORY.IMAGE
        }
      ]
    }
  ]

  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  getMetaContent(pageName, tagName) {
    const page = this.metaTagOfPage.find(tag => {
      if(pageName) pageName = pageName.split('?')[0]
      return tag.page.includes(pageName);
    })

    if (!page) {
      return this.getMetaContent('/landing-jobseeker', tagName);
    }

    const listTag = page.listTag;
    const tag = listTag.find(item => {
      return item.name == tagName;
    })

    return tag ? tag.content : null;
  }

  changeMetaTag(listTag) {
    listTag.forEach(tag => {
      if (tag.title == 'title') {
        this.title.setTitle(tag.content);
      }
      if (tag.title != 'image') {
        this.meta.updateTag(
          {
            name: tag.title,
            content: tag.content
          }
        )
      }
      this.meta.updateTag(
        {
          name: `og:${tag.title}`,
          content: tag.content
        }
      )

      this.meta.updateTag(
        {
          name: `twitter:${tag.title}`,
          content: tag.content
        }
      )
    })
    this.updateOtherMetaTag();
  }

  changeMetaTagByPage(page = '') {
    const listTag = ['title', 'description', 'image'];
    listTag.forEach(tag => {
      const content = this.getMetaContent(page, tag);
      if (content) {
        if (tag == 'title') {
          this.title.setTitle(content);
        }
        if (tag != 'image') {
          this.meta.updateTag(
            {
              name: tag,
              content: content
            }
          )
        }
        this.meta.updateTag(
          {
            name: `og:${tag}`,
            content: content
          }
        )
        this.meta.updateTag(
          {
            name: `twitter:${tag}`,
            content: content
          }
        )
      }
    })
    this.updateOtherMetaTag();
  }
  updateOtherMetaTag() {
    const metas = [
      {
        title: 'og:url',
        content: window.location.href
      },
      {
        title: 'twitter:url',
        content: window.location.href
      },
      {
        title: 'og:type',
        content: 'website'
      },
      {
        title: 'twitter:title',
        content: 'website'
      },
      {
        title: 'twitter:card',
        content: 'summary_large_image'
      },
    ]
    metas.map(meta => {
      this.meta.updateTag(
        {
          name: meta.title,
          content: meta.content
        }
      )
    })
  }

  checkUserAgentBot() {
    const botPattern = /bot|googlebot|crawler|spider|robot|Pagespeed|crawling/i.test(navigator.userAgent);
    if (botPattern) return true;
    return false;
  }

  checkLightHouseChorme() {
    const botPattern = /bot|Chrome-Lighthouse|Pagespeed/i.test(navigator.userAgent);
    if (botPattern) return true;
    return false;
    //if (navigator.userAgent.includes('Chrome-Lighthouse')) return true;
  }
}
