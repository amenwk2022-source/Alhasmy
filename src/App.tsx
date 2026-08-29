import React, { useState, useEffect } from 'react';
import { 
  TabType, 
  NewsItem, 
  EventItem,
  UserProfile,
  ForumTopic,
  ForumReply,
  ForumNotification,
  DiwanNotice, 
  FundProject, 
  FamilyBranch, 
  CouncilMember, 
  HeritageItem, 
  RegisteredMember,
  LineageVerificationRequest,
  AidApplication
} from './types';
import { 
  INITIAL_BRANCHES, 
  LINEAGE_ROOT_NODES, 
  INITIAL_NEWS, 
  INITIAL_EVENTS,
  CURRENT_USER_PROFILE,
  INITIAL_FORUM_TOPICS,
  INITIAL_FORUM_NOTIFICATIONS,
  INITIAL_NOTICES, 
  INITIAL_FUND_PROJECTS, 
  INITIAL_HERITAGE, 
  INITIAL_COUNCIL, 
  INITIAL_REGISTERED_MEMBERS,
  INITIAL_VERIFICATION_REQUESTS,
  INITIAL_AID_APPLICATIONS
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { GenealogyView } from './components/GenealogyView';
import { DiwanView } from './components/DiwanView';
import { SolidarityFundView } from './components/SolidarityFundView';
import { CouncilView } from './components/CouncilView';
import { HeritageView } from './components/HeritageView';
import { DirectoryView } from './components/DirectoryView';
import { UserProfileView } from './components/UserProfileView';
import { NewsAndEventsView } from './components/NewsAndEventsView';
import { ForumView } from './components/ForumView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdminLoginView } from './components/AdminLoginView';

import { RegisterMemberModal } from './components/RegisterMemberModal';
import { AddNoticeModal } from './components/AddNoticeModal';
import { DonateModal } from './components/DonateModal';
import { GenealogyVerifyModal } from './components/GenealogyVerifyModal';
import { MemberCardModal } from './components/MemberCardModal';
import { CertificateModal } from './components/CertificateModal';
import { PersonalFamilyTreeModal } from './components/PersonalFamilyTreeModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States with localStorage persistence fallback
  const [branches] = useState<FamilyBranch[]>(INITIAL_BRANCHES);
  const [rootNodes] = useState(LINEAGE_ROOT_NODES);
  const [heritage] = useState<HeritageItem[]>(INITIAL_HERITAGE);
  const [council] = useState<CouncilMember[]>(INITIAL_COUNCIL);

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bh_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return CURRENT_USER_PROFILE;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('bh_news');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_NEWS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('bh_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_EVENTS;
  });

  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(() => {
    const saved = localStorage.getItem('bh_forum_topics');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_FORUM_TOPICS;
  });

  const [forumNotifications, setForumNotifications] = useState<ForumNotification[]>(() => {
    const saved = localStorage.getItem('bh_forum_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_FORUM_NOTIFICATIONS;
  });

  const [notices, setNotices] = useState<DiwanNotice[]>(() => {
    const saved = localStorage.getItem('bh_notices');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_NOTICES;
  });

  const [fundProjects, setFundProjects] = useState<FundProject[]>(() => {
    const saved = localStorage.getItem('bh_fund_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_FUND_PROJECTS;
  });

  const [members, setMembers] = useState<RegisteredMember[]>(() => {
    const saved = localStorage.getItem('bh_members');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_REGISTERED_MEMBERS;
  });

  const [verificationRequests, setVerificationRequests] = useState<LineageVerificationRequest[]>(() => {
    const saved = localStorage.getItem('bh_verification_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_VERIFICATION_REQUESTS;
  });

  const [aidApplications, setAidApplications] = useState<AidApplication[]>(() => {
    const saved = localStorage.getItem('bh_aid_applications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_AID_APPLICATIONS;
  });

  // Selected sub-state
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(undefined);
  const [selectedMemberForCard, setSelectedMemberForCard] = useState<RegisteredMember | UserProfile | null>(null);
  const [selectedMemberForCert, setSelectedMemberForCert] = useState<RegisteredMember | UserProfile | null>(null);
  const [donateProjectId, setDonateProjectId] = useState<string | undefined>(undefined);

  // Standalone Admin Authentication State (User: admin / Pass: amen011)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bh_admin_auth') === 'true';
  });

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('bh_admin_auth', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('bh_admin_auth');
    setCurrentTab('home');
  };

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAddNoticeModalOpen, setIsAddNoticeModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isGenealogyVerifyModalOpen, setIsGenealogyVerifyModalOpen] = useState(false);
  const [isMemberCardModalOpen, setIsMemberCardModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isPersonalTreeModalOpen, setIsPersonalTreeModalOpen] = useState(false);

  // Persist modifications
  useEffect(() => {
    localStorage.setItem('bh_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bh_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('bh_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('bh_forum_topics', JSON.stringify(forumTopics));
  }, [forumTopics]);

  useEffect(() => {
    localStorage.setItem('bh_forum_notifications', JSON.stringify(forumNotifications));
  }, [forumNotifications]);

  useEffect(() => {
    localStorage.setItem('bh_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('bh_fund_projects', JSON.stringify(fundProjects));
  }, [fundProjects]);

  useEffect(() => {
    localStorage.setItem('bh_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('bh_verification_requests', JSON.stringify(verificationRequests));
  }, [verificationRequests]);

  useEffect(() => {
    localStorage.setItem('bh_aid_applications', JSON.stringify(aidApplications));
  }, [aidApplications]);

  // Actions for User Profile
  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
  };

  // Actions for News and Events
  const handleAddNewsItem = (item: NewsItem) => {
    setNews((prev) => [item, ...prev]);
  };

  const handleAddEventItem = (event: EventItem) => {
    setEvents((prev) => [event, ...prev]);
  };

  const handleToggleEventRSVP = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const newAttending = !ev.isUserAttending;
          return {
            ...ev,
            isUserAttending: newAttending,
            confirmedAttendeesCount: newAttending
              ? ev.confirmedAttendeesCount + 1
              : Math.max(0, ev.confirmedAttendeesCount - 1),
          };
        }
        return ev;
      })
    );
  };

  const handleLikeNews = (newsId: string) => {
    setNews((prev) =>
      prev.map((n) => {
        if (n.id === newsId) {
          const isLiked = !n.userLiked;
          return {
            ...n,
            userLiked: isLiked,
            likes: isLiked ? n.likes + 1 : Math.max(0, n.likes - 1),
          };
        }
        return n;
      })
    );
  };

  // Actions for Forum
  const handleAddForumTopic = (topic: ForumTopic) => {
    setForumTopics((prev) => [topic, ...prev]);
    // Also update profile post count
    setCurrentUser((prev) => ({
      ...prev,
      forumPostsCount: (prev.forumPostsCount || 0) + 1,
    }));
  };

  const handleAddForumReply = (topicId: string, reply: ForumReply) => {
    setForumTopics((prev) =>
      prev.map((top) => {
        if (top.id === topicId) {
          return {
            ...top,
            repliesCount: top.repliesCount + 1,
            lastActivity: 'الآن',
            replies: [...top.replies, reply],
          };
        }
        return top;
      })
    );
  };

  const handleToggleLikeTopic = (topicId: string) => {
    setForumTopics((prev) =>
      prev.map((top) => {
        if (top.id === topicId) {
          const isLiked = !top.userLiked;
          return {
            ...top,
            userLiked: isLiked,
            likesCount: isLiked ? top.likesCount + 1 : Math.max(0, top.likesCount - 1),
          };
        }
        return top;
      })
    );
  };

  const handleToggleLikeReply = (topicId: string, replyId: string) => {
    setForumTopics((prev) =>
      prev.map((top) => {
        if (top.id === topicId) {
          const updatedReplies = top.replies.map((rep) => {
            if (rep.id === replyId) {
              const isLiked = !rep.userLiked;
              return {
                ...rep,
                userLiked: isLiked,
                likes: isLiked ? rep.likes + 1 : Math.max(0, rep.likes - 1),
              };
            }
            return rep;
          });
          return { ...top, replies: updatedReplies };
        }
        return top;
      })
    );
  };

  const handleTogglePinTopic = (topicId: string) => {
    setForumTopics((prev) =>
      prev.map((top) => {
        if (top.id === topicId) {
          return { ...top, isPinned: !top.isPinned };
        }
        return top;
      })
    );
  };

  const handleToggleLockTopic = (topicId: string) => {
    setForumTopics((prev) =>
      prev.map((top) => {
        if (top.id === topicId) {
          return { ...top, isLocked: !top.isLocked };
        }
        return top;
      })
    );
  };

  const handleDeleteForumTopic = (topicId: string) => {
    setForumTopics((prev) => prev.filter((top) => top.id !== topicId));
  };

  const handleMarkNotificationsRead = () => {
    setForumNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Actions for Notices, Members, Donations
  const handleBlessNotice = (noticeId: string) => {
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId) {
          const blessed = !n.userBlessed;
          return {
            ...n,
            userBlessed: blessed,
            blessingsCount: blessed ? n.blessingsCount + 1 : Math.max(0, n.blessingsCount - 1),
          };
        }
        return n;
      })
    );
  };

  const handleAddComment = (noticeId: string, author: string, text: string) => {
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId) {
          const newComments = [
            ...(n.comments || []),
            {
              id: 'c-' + Date.now(),
              author,
              text,
              date: 'الآن',
            },
          ];
          return { ...n, comments: newComments };
        }
        return n;
      })
    );
  };

  const handleAddNotice = (notice: DiwanNotice) => {
    setNotices((prev) => [notice, ...prev]);
  };

  const handleRegisterMember = (newMember: RegisteredMember) => {
    setMembers((prev) => [newMember, ...prev]);
  };

  const handleDonationSuccess = (projectId: string, amount: number) => {
    setFundProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            raisedAmount: p.raisedAmount + amount,
            beneficiariesCount: p.beneficiariesCount + Math.max(1, Math.floor(amount / 500)),
          };
        }
        return p;
      })
    );
  };

  const handleOpenDonate = (projectId?: string) => {
    setDonateProjectId(projectId);
    setIsDonateModalOpen(true);
  };

  const handleViewMemberCard = (member: RegisteredMember | UserProfile) => {
    setSelectedMemberForCard(member);
    setIsMemberCardModalOpen(true);
  };

  const handleViewCertificate = (member: RegisteredMember | UserProfile) => {
    setSelectedMemberForCert(member);
    setIsCertificateModalOpen(true);
  };

  const handleOpenMemberCardForCurrentUser = () => {
    setSelectedMemberForCard(currentUser);
    setIsMemberCardModalOpen(true);
  };

  const handleOpenCertificateForCurrentUser = () => {
    setSelectedMemberForCert(currentUser);
    setIsCertificateModalOpen(true);
  };

  const handleOpenPersonalTreeForCurrentUser = () => {
    setIsPersonalTreeModalOpen(true);
  };

  const handleUpdateMemberPhoto = (photoUrl: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      avatarUrl: photoUrl,
    }));
  };

  // Admin Dashboard Actions
  const handleApproveVerification = (requestId: string, assignedMembershipNo: string) => {
    setVerificationRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'approved',
            reviewedAt: new Date().toLocaleDateString('ar-EG'),
            reviewerName: currentUser.fullName,
            assignedMembershipNumber: assignedMembershipNo,
            adminNotes: 'تمت المراجعة والتصديق وفق الوثائق والمشجر المرفق.',
          };
        }
        return req;
      })
    );

    // Auto-create registered member from approved request if not exists
    const targetReq = verificationRequests.find((r) => r.id === requestId);
    if (targetReq) {
      const newMember: RegisteredMember = {
        id: 'mem-' + Date.now(),
        fullName: targetReq.applicantName,
        branch: targetReq.claimedBranch,
        subClan: targetReq.subClan,
        membershipNumber: assignedMembershipNo,
        city: targetReq.governorate,
        country: 'مصر',
        joinDate: new Date().toLocaleDateString('ar-EG'),
        isVerified: true,
        generation: 38,
        phone: targetReq.phone,
        email: 'info@alashraf-eg.org',
      };
      setMembers((prev) => [newMember, ...prev]);
    }
  };

  const handleRejectVerification = (requestId: string, reason: string) => {
    setVerificationRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'rejected',
            reviewedAt: new Date().toLocaleDateString('ar-EG'),
            reviewerName: currentUser.fullName,
            adminNotes: reason || 'لم تتطابق الوثائق مع سجلات السادة الأشراف بني هاشم بمصر.',
          };
        }
        return req;
      })
    );
  };

  const handleRequestMoreDocs = (requestId: string, notes: string) => {
    setVerificationRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'needs_documents',
            adminNotes: notes || 'يرجى تقديم حجة نسب أو شهادة ميلاد الجد المصدقة من دار الوثائق المصرية.',
          };
        }
        return req;
      })
    );
  };

  const handleApproveAid = (aidId: string) => {
    setAidApplications((prev) =>
      prev.map((app) => {
        if (app.id === aidId) {
          return {
            ...app,
            status: 'approved',
            approvedAmount: app.requestedAmount,
            reviewedAt: new Date().toLocaleDateString('ar-EG'),
            reviewerNotes: 'تمت الموافقة وصرف الإعانة من صندوق التكافل والوقف الهاشمي.',
          };
        }
        return app;
      })
    );
  };

  const handleToggleMemberVerification = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return { ...m, verified: !m.verified };
        }
        return m;
      })
    );
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleAddMemberFromAdmin = (member: RegisteredMember) => {
    setMembers((prev) => [member, ...prev]);
  };

  const handleSelectBranch = (branchId: string) => {
    setSelectedBranchId(branchId);
    setCurrentTab('genealogy');
  };

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fdfcf6] text-[#1a1a1a] flex flex-col font-sans-ar selection:bg-[#d4af37]/30 selection:text-[#064e3b]">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        currentUser={currentUser}
        onSelectTab={handleTabChange}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenAddNoticeModal={() => setIsAddNoticeModalOpen(true)}
        onOpenDonateModal={() => handleOpenDonate()}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && currentTab === 'home') {
            setCurrentTab('directory');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            news={news}
            notices={notices}
            fundProjects={fundProjects}
            branches={branches}
            council={council}
            onSelectTab={handleTabChange}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onOpenAddNoticeModal={() => setIsAddNoticeModalOpen(true)}
            onOpenDonateModal={handleOpenDonate}
            onBlessNotice={handleBlessNotice}
            onSelectBranch={handleSelectBranch}
            onOpenMemberCard={handleOpenMemberCardForCurrentUser}
            onOpenCertificate={handleOpenCertificateForCurrentUser}
            onOpenPersonalTree={handleOpenPersonalTreeForCurrentUser}
          />
        )}

        {currentTab === 'admin' && (
          isAdminAuthenticated ? (
            <AdminDashboardView
              members={members}
              branches={branches}
              notices={notices}
              currentUser={currentUser}
              verificationRequests={verificationRequests}
              aidApplications={aidApplications}
              onApproveVerification={handleApproveVerification}
              onRejectVerification={handleRejectVerification}
              onRequestMoreDocs={handleRequestMoreDocs}
              onApproveAid={handleApproveAid}
              onToggleMemberVerification={handleToggleMemberVerification}
              onDeleteMember={handleDeleteMember}
              onAddMember={handleAddMemberFromAdmin}
              onViewMemberCard={handleViewMemberCard}
              onViewCertificate={handleViewCertificate}
              onOpenPersonalTree={handleOpenPersonalTreeForCurrentUser}
              onAdminLogout={handleAdminLogout}
            />
          ) : (
            <AdminLoginView
              onLoginSuccess={handleAdminLoginSuccess}
              onBackToHome={() => setCurrentTab('home')}
            />
          )
        )}

        {currentTab === 'profile' && (
          <UserProfileView
            user={currentUser}
            branches={branches}
            onUpdateUser={handleUpdateUser}
            onOpenGenealogyVerify={() => setIsGenealogyVerifyModalOpen(true)}
          />
        )}

        {currentTab === 'news' && (
          <NewsAndEventsView
            news={news}
            events={events}
            onAddNewsItem={handleAddNewsItem}
            onAddEventItem={handleAddEventItem}
            onToggleEventRSVP={handleToggleEventRSVP}
            onLikeNews={handleLikeNews}
          />
        )}

        {currentTab === 'forum' && (
          <ForumView
            topics={forumTopics}
            notifications={forumNotifications}
            currentUser={currentUser}
            onAddTopic={handleAddForumTopic}
            onAddReply={handleAddForumReply}
            onToggleLikeTopic={handleToggleLikeTopic}
            onToggleLikeReply={handleToggleLikeReply}
            onTogglePinTopic={handleTogglePinTopic}
            onToggleLockTopic={handleToggleLockTopic}
            onDeleteTopic={handleDeleteForumTopic}
            onMarkNotificationsRead={handleMarkNotificationsRead}
          />
        )}

        {currentTab === 'genealogy' && (
          <GenealogyView
            branches={branches}
            rootNodes={rootNodes}
            selectedBranchId={selectedBranchId}
            onOpenGenealogyVerifyModal={() => setIsGenealogyVerifyModalOpen(true)}
          />
        )}

        {currentTab === 'diwan' && (
          <DiwanView
            notices={notices}
            onBlessNotice={handleBlessNotice}
            onAddComment={handleAddComment}
            onOpenAddNoticeModal={() => setIsAddNoticeModalOpen(true)}
          />
        )}

        {currentTab === 'fund' && (
          <SolidarityFundView
            projects={fundProjects}
            onOpenDonateModal={handleOpenDonate}
          />
        )}

        {currentTab === 'council' && (
          <CouncilView
            councilMembers={council}
          />
        )}

        {currentTab === 'heritage' && (
          <HeritageView
            heritageItems={heritage}
          />
        )}

        {currentTab === 'directory' && (
          <DirectoryView
            members={members}
            branches={branches}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onViewMemberCard={handleViewMemberCard}
            onViewCertificate={handleViewCertificate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={handleTabChange}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenGenealogyVerifyModal={() => setIsGenealogyVerifyModalOpen(true)}
      />

      {/* Interactive Modals */}
      <RegisterMemberModal
        branches={branches}
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterSuccess={handleRegisterMember}
      />

      <AddNoticeModal
        branches={branches}
        isOpen={isAddNoticeModalOpen}
        onClose={() => setIsAddNoticeModalOpen(false)}
        onAddNotice={handleAddNotice}
      />

      <DonateModal
        projects={fundProjects}
        defaultProjectId={donateProjectId}
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        onDonationSuccess={handleDonationSuccess}
      />

      <GenealogyVerifyModal
        branches={branches}
        isOpen={isGenealogyVerifyModalOpen}
        onClose={() => setIsGenealogyVerifyModalOpen(false)}
      />

      {isMemberCardModalOpen && (
        <MemberCardModal
          member={selectedMemberForCard || currentUser}
          onClose={() => {
            setIsMemberCardModalOpen(false);
            setSelectedMemberForCard(null);
          }}
          onUpdateMemberPhoto={handleUpdateMemberPhoto}
        />
      )}

      {isCertificateModalOpen && (
        <CertificateModal
          member={selectedMemberForCert || currentUser}
          onClose={() => {
            setIsCertificateModalOpen(false);
            setSelectedMemberForCert(null);
          }}
        />
      )}

      {isPersonalTreeModalOpen && (
        <PersonalFamilyTreeModal
          user={currentUser}
          onClose={() => setIsPersonalTreeModalOpen(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
}

