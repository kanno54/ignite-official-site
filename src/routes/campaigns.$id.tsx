import React from 'react';
import { useParams } from 'react-router-dom';
import { getCampaignById, getArticles } from '../utils/contentLoader';
import { NotFoundPage } from './404';
import { SilentSignalCampaignView } from '../components/campaigns/SilentSignalCampaignView';
import { RiseAgainCampaignView } from '../components/campaigns/RiseAgainCampaignView';
import { EquinoxCampaignView } from '../components/campaigns/EquinoxCampaignView';
import { LiveAlbumCampaignView } from '../components/campaigns/LiveAlbumCampaignView';
import { StandardCampaignView } from '../components/campaigns/StandardCampaignView';

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const campaign = id ? getCampaignById(id) : undefined;

  if (!campaign) {
    return <NotFoundPage />;
  }


  const allArticles = getArticles();
  const relatedArticles = allArticles.filter((art) => campaign.relatedArticleIds.includes(art.slug) || campaign.relatedArticleIds.includes(art.id));

  if (campaign.id === 'equinox') {
    return <EquinoxCampaignView campaign={campaign} relatedArticles={relatedArticles} />;
  }

  if (campaign.id === 'live-album-2024') {
    return <LiveAlbumCampaignView campaign={campaign} relatedArticles={relatedArticles} />;
  }

  if (campaign.id === 'silent-signal') {
    return <SilentSignalCampaignView campaign={campaign} relatedArticles={relatedArticles} />;
  }

  if (campaign.id === 'rise-again') {
    return <RiseAgainCampaignView campaign={campaign} relatedArticles={relatedArticles} />;
  }

  return <StandardCampaignView campaign={campaign} />;
};
