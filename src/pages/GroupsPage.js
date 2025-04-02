import React, { useState, useEffect } from 'react';
import { FaSearch, FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import './GroupsPage.css';

const GroupsPage = ({ isAuthenticated, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  
  // Sample groups data (in a real app, this would come from an API)
  const groups = [
    // Academic Groups
    { 
      id: 1, 
      name: 'S6 CSE', 
      category: 'academic',
      description: 'Official group for CSE Semester 6 students. Share notes, discuss doubts, and stay updated with class announcements.',
      links: {
        whatsapp: 'https://chat.whatsapp.com/AbCdEfGhIjKlMnOp',
        instagram: 'https://instagram.com/cusat.cse.s6',
        linkedin: 'https://linkedin.com/groups/cusat-cse-s6'
      }
    },
    { 
      id: 2, 
      name: 'S4 IT', 
      category: 'academic',
      description: 'Group for IT Semester 4 students. Project coordination, assignment help, and exam preparation.',
      links: {
        whatsapp: 'https://chat.whatsapp.com/QrStUvWxYzAbCd',
        instagram: 'https://instagram.com/cusat.it.s4',
        linkedin: 'https://linkedin.com/groups/cusat-it-s4'
      }
    },
    { 
      id: 3, 
      name: 'S8 ECE', 
      category: 'academic',
      description: 'Final year ECE student group for placement preparation, project collaboration, and academic support.',
      links: {
        whatsapp: 'https://chat.whatsapp.com/EfGhIjKlMnOp',
        instagram: 'https://instagram.com/cusat.ece.s8',
        linkedin: 'https://linkedin.com/groups/cusat-ece-s8'
      }
    },
    { 
      id: 4, 
      name: 'S2 ME', 
      category: 'academic',
      description: 'Mechanical Engineering Semester 2 student group for academic discussions and resource sharing.',
      links: {
        whatsapp: 'https://chat.whatsapp.com/XyZaBcDeF',
        instagram: 'https://instagram.com/cusat.me.s2',
        linkedin: null
      }
    },
    
    // Clubs
    { 
      id: 5, 
      name: 'IRES SEDS', 
      category: 'club',
      description: 'Indian Rocketry and Engineering Society - Students for the Exploration and Development of Space.',
      links: {
        whatsapp: 'https://chat.whatsapp.com/GhIjKlMnOpQ',
        instagram: 'https://instagram.com/ires_seds_cusat',
        linkedin: 'https://linkedin.com/groups/ires-seds-cusat'
      }
    },
    { 
      id: 6, 
      name: 'Coding Club', 
      category: 'club',
      description: 'CUSAT coding enthusiasts club for competitive programming, hackathons, and coding challenges.',
      links: {
        whatsapp: 'https://chat.whatsapp.com/RsTuVwXyZ',
        instagram: 'https://instagram.com/cusat_coding_club',
        linkedin: 'https://linkedin.com/groups/cusat-coding-club'
      }
    },
    { 
      id: 7, 
      name: 'IEEE SB CUSAT', 
      category: 'club',
      description: 'IEEE Student Branch of CUSAT for technical events, workshops, and professional development.',
      links: {
        whatsapp: 'https://chat.whatsapp.com/AbCdEfGhIj',
        instagram: 'https://instagram.com/ieee_sb_cusat',
        linkedin: 'https://linkedin.com/groups/ieee-sb-cusat'
      }
    },
    { 
      id: 8, 
      name: 'Arts Club', 
      category: 'club',
      description: 'CUSAT Arts Club for cultural activities, performances, and creative events on campus.',
      links: {
        whatsapp: 'https://chat.whatsapp.com/KlMnOpQrSt',
        instagram: 'https://instagram.com/cusat_arts_club',
        linkedin: null
      }
    },
  ];

  useEffect(() => {
    // Filter groups based on search query
    if (searchQuery.trim() === '') {
      setFilteredGroups(groups);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = groups.filter(group => 
        group.name.toLowerCase().includes(lowercasedQuery) || 
        group.description.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredGroups(filtered);
    }
  }, [searchQuery]);

  // Group by category
  const academicGroups = filteredGroups.filter(group => group.category === 'academic');
  const clubGroups = filteredGroups.filter(group => group.category === 'club');

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      
      <div className="groups-page">
        <h1 className="page-title">Student Groups</h1>
        <p className="page-subtitle">Connect with your classmates and join academic groups and clubs</p>
        
        <div className="search-container">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search for groups..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
        
        <div className="groups-section">
          <h2 className="section-title">Academic Groups</h2>
          <div className="groups-grid">
            {academicGroups.length > 0 ? (
              academicGroups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-circle">
                    <span className="group-name">{group.name}</span>
                  </div>
                  <div className="group-description">
                    <p>{group.description}</p>
                  </div>
                  <div className="social-links">
                    {group.links.whatsapp && (
                      <a href={group.links.whatsapp} target="_blank" rel="noopener noreferrer" className="social-link whatsapp" title="Join WhatsApp Group">
                        <FaWhatsapp />
                      </a>
                    )}
                    {group.links.instagram && (
                      <a href={group.links.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram" title="Follow on Instagram">
                        <FaInstagram />
                      </a>
                    )}
                    {group.links.linkedin && (
                      <a href={group.links.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin" title="Connect on LinkedIn">
                        <FaLinkedin />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No academic groups found matching your search.</p>
            )}
          </div>
        </div>
        
        <div className="groups-section">
          <h2 className="section-title">Clubs</h2>
          <div className="groups-grid">
            {clubGroups.length > 0 ? (
              clubGroups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-circle">
                    <span className="group-name">{group.name}</span>
                  </div>
                  <div className="group-description">
                    <p>{group.description}</p>
                  </div>
                  <div className="social-links">
                    {group.links.whatsapp && (
                      <a href={group.links.whatsapp} target="_blank" rel="noopener noreferrer" className="social-link whatsapp" title="Join WhatsApp Group">
                        <FaWhatsapp />
                      </a>
                    )}
                    {group.links.instagram && (
                      <a href={group.links.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram" title="Follow on Instagram">
                        <FaInstagram />
                      </a>
                    )}
                    {group.links.linkedin && (
                      <a href={group.links.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin" title="Connect on LinkedIn">
                        <FaLinkedin />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No clubs found matching your search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;