import React from 'react';
import Image from 'next/image';

interface NavItem {
  id: string;
  label: string;
  svg: string;
  badge?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export default function AdminSidebar({ activeTab, setActiveTab, user, handleLogout }: any) {
  const navSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        {
          id: 'dashboard',
          label: 'Overview',
          svg: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
        },
        {
          id: 'vod',
          label: 'VOD Library',
          svg: 'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z',
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          id: 'gifts',
          label: 'Welcome Gifts',
          svg: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z',
        },
        {
          id: 'notifications',
          label: 'Announcements',
          svg: 'M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z',
        },
        {
          id: 'locations',
          label: 'Hub Geofences',
          svg: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        },
        {
          id: 'feedback',
          label: 'Partner Feedback',
          svg: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
        },
        {
          id: 'members',
          label: 'Member Directory',
          svg: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'settings',
          label: 'Integration & Audit',
          svg: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
        },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 10,
        boxShadow: '1px 0 3px rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* BRAND HEADER */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image
            src="/brand/ilc-logo.png"
            alt="Island Living Channel"
            width={135}
            height={38}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginTop: '0.75rem',
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--palm-green)',
            backgroundColor: 'var(--palm-light)',
            padding: '0.2rem 0.5rem',
            borderRadius: '12px',
            letterSpacing: '0.06em',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--palm-green)' }} />
          Editorial Console
        </div>
      </div>

      {/* NAVIGATION ITEMS */}
      <nav
        style={{
          flex: 1,
          padding: '1rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          overflowY: 'auto',
        }}
      >
        {navSections.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <p
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--muted-text)',
                  padding: '0 0.75rem 0.375rem',
                  margin: 0,
                }}
              >
                {section.title}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--palm-green)' : 'var(--ink)',
                      backgroundColor: isActive ? 'var(--palm-light)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      position: 'relative',
                      transition: 'all 0.15s ease-in-out',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{
                          opacity: isActive ? 1 : 0.6,
                          color: isActive ? 'var(--palm-green)' : 'currentColor',
                          flexShrink: 0,
                          transition: 'opacity 0.15s ease',
                        }}
                        aria-hidden="true"
                      >
                        <path d={item.svg} />
                      </svg>
                      <span>{item.label}</span>
                    </div>

                    {/* Left active border marker */}
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '20%',
                          bottom: '20%',
                          width: '3px',
                          borderRadius: '0 2px 2px 0',
                          backgroundColor: 'var(--palm-green)',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* USER PROFILE & SIGNOUT */}
      <div
        style={{
          padding: '0.875rem 1rem',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface-alt)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--palm-green)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
              flexShrink: 0,
            }}
          >
            {user.display_name?.charAt(0) || 'U'}
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                border: '2px solid #fff',
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                margin: 0,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                color: 'var(--ink)',
              }}
            >
              {user.display_name}
            </p>
            <p
              style={{
                fontSize: '0.6875rem',
                color: 'var(--muted-text)',
                margin: 0,
                textTransform: 'capitalize',
              }}
            >
              {user.role}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.375rem',
              borderRadius: '6px',
              color: 'var(--muted-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}