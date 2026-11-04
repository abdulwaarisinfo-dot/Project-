import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://writora.live';

const BLOG_DATE = new Date('2026-11-04');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/tools/improve-writing`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tools/reply-generator`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tools/change-tone`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tools/fix-grammar`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tools/shorten-text`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tools/simplify-text`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tools/write-professional-email`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/tools/polite-refusal`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/tools/follow-up-email`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/blog`, lastModified: BLOG_DATE, changeFrequency: 'weekly', priority: 0.8 },
    {
      url: `${BASE_URL}/blog/how-to-politely-decline-a-meeting-request`,
      lastModified: BLOG_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/how-to-reply-to-a-rude-email-professionally`,
      lastModified: BLOG_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/how-to-follow-up-on-a-job-application`,
      lastModified: BLOG_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/formal-vs-professional-vs-casual-email-tone`,
      lastModified: BLOG_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/how-to-shorten-a-long-email`,
      lastModified: BLOG_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
