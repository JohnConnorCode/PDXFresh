import { EyeOpenIcon } from '@sanity/icons';
import { DocumentActionComponent } from 'sanity';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const previewSecret = process.env.SANITY_PREVIEW_SECRET || 'secret';

export const OpenPreviewAction: DocumentActionComponent = (props) => {
  const { type, id, draft, published } = props;

  // Only show for document types that have slugs and pages
  const previewableTypes = [
    'page',
    'post',
    'homePage',
    'aboutPage',
    'blendsPage',
    'faqPage',
    'processPage',
    'ingredientsSourcingPage',
    'subscriptionsPage',
    'wholesalePage',
  ];

  if (!previewableTypes.includes(type)) {
    return null;
  }

  // Get the slug from the document
  const slug = (draft || published)?.slug?.current || id;

  const previewUrl = `${siteUrl}/api/draft?secret=${previewSecret}&type=${type}&slug=${slug}`;

  return {
    label: 'Open Preview',
    icon: EyeOpenIcon,
    onHandle: () => {
      window.open(previewUrl, '_blank');
    },
  };
};
