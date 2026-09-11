import React, { useState, useEffect } from 'react';

function ResumeEditor({ resumeText, onBack, onSave }) {
  const [editedText, setEditedText] = useState(resumeText);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(new Set());

  const skillCategories = {
    technical: new Set([
      'javascript', 'python', 'java', 'csharp', 'cplusplus', 'golang', 'rust', 'swift', 'kotlin', 'php', 'ruby', 'perl', 'c#', 'c++',
      'react', 'angular', 'vue', 'svelte', 'nextjs', 'nuxt', 'ember',
      'nodejs', 'node.js', 'express', 'django', 'flask', 'fastapi', 'spring', 'springboot', 'laravel', 'rails', 'asp.net', '.net', '.net framework',
      'mongodb', 'postgresql', 'mysql', 'oracle', 'redis', 'cassandra', 'elasticsearch', 'sqlite', 'sql',
      'aws', 'azure', 'gcp', 'googlecloud', 'heroku', 'digitalocean', 'linode',
      'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab', 'github', 'bitbucket',
      'git', 'svn', 'mercurial', 'version control',
      'rest', 'graphql', 'grpc', 'soap', 'api', 'microservices', 'serverless',
      'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
      'typescript', 'coffeescript', 'dart',
      'linux', 'windows', 'macos', 'unix',
      'agile', 'scrum', 'kanban', 'jira', 'trello', 'asana',
      'ci/cd', 'devops', 'deployment', 'containerization',
      'testing', 'junit', 'pytest', 'mocha', 'jasmine', 'rspec', 'selenium', 'cypress',
      'webpack', 'vite', 'rollup', 'gulp', 'grunt',
      'machine learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'opencv',
      'data analysis', 'etl', 'big data', 'hadoop', 'spark', 'snowflake',
      'blockchain', 'solidity', 'web3',
      'lambda', 's3', 'rds', 'ec2', 'dynamodb',
      'cosmos', 'functions',
      'firestore', 'bigquery',
      'api gateway', 'load balancing', 'caching', 'cdn',
      'security', 'oauth', 'jwt', 'authentication', 'authorization', 'encryption',
      'mobile', 'ios', 'android', 'reactnative', 'flutter',
      'spa', 'pwa', 'ssr', 'ssg', 'jamstack',
      'microsoft technology stack', 'microsoft', 'technology stack'
    ]),
    soft: new Set([
      'communication', 'leadership', 'teamwork', 'collaboration', 'adaptability', 'problemsolving', 'analytical', 'problem solving',
      'creativity', 'critical thinking', 'time management', 'organization', 'attention to detail', 'detail oriented',
      'project management', 'stakeholder management', 'negotiation', 'presentation', 'public speaking',
      'mentoring', 'training', 'coaching', 'customer service', 'client relations',
      'emotional intelligence', 'selfawareness', 'self awareness', 'selfregulation', 'self regulation', 'empathy', 'motivation', 'social skills',
      'flexible', 'flexibility', 'collaborative', 'collaborative environment',
      'feedback', 'evolve', 'improve', 'continuous improvement',
      'attention', 'detail', 'customer', 'expectations'
    ]),
    certifications: new Set([
      'pmp', 'capm', 'csm', 'psm', 'ceh', 'cissp', 'cism', 'ccna', 'cka', 'az-900', 'az-104', 'az-204',
      'aws', 'saa-c03', 'ccp', 'gcp', 'gace', 'google', 'azure', 'kubernetes',
      'agile', 'scrum', 'itil', 'prince2', 'lean', 'six sigma',
      'bachelor', 'degree', 'masters', 'computer science', 'software engineering', 'internship', 'academic'
    ]),
  };

  const categorizeKeyword = (word) => {
    for (const [category, skills] of Object.entries(skillCategories)) {
      if (skills.has(word)) {
        return category;
      }
    }
    return 'other';
  };

  const extractAllSkills = (text) => {
    const lowerText = text.toLowerCase();
    const skillsMap = new Map();

    for (const [category, skillSet] of Object.entries(skillCategories)) {
      skillSet.forEach(skill => {
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        let match;
        while ((match = regex.exec(lowerText)) !== null) {
          const skillLower = skill.toLowerCase();
          if (!skillsMap.has(skillLower)) {
            skillsMap.set(skillLower, { skill: skillLower, category, count: 0 });
          }
          skillsMap.get(skillLower).count += 1;
        }
      });
    }

    return Array.from(skillsMap.values()).sort((a, b) => b.count - a.count);
  };

  useEffect(() => {
    const skills = extractAllSkills(editedText);
    setExtractedSkills(skills);
    setSelectedSkills(new Set(skills.map(s => s.skill)));
  }, [editedText]);

  const toggleSkill = (skill) => {
    const newSet = new Set(selectedSkills);
    if (newSet.has(skill)) {
      newSet.delete(skill);
    } else {
      newSet.add(skill);
    }
    setSelectedSkills(newSet);
  };

  const handleSave = () => {
    onSave(editedText);
  };

  const handleAddSkillFromInput = (skill) => {
    if (skill.trim()) {
      const trimmedSkill = skill.trim().toLowerCase();
      const exists = extractedSkills.some(s => s.skill === trimmedSkill);
      if (!exists) {
        const category = categorizeKeyword(trimmedSkill);
        setExtractedSkills([...extractedSkills, { skill: trimmedSkill, category, count: 1 }]);
        setSelectedSkills(new Set([...selectedSkills, trimmedSkill]));
      }
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>Resume Editor</h2>
        <button className="back-button" onClick={onBack}>← Back</button>
      </div>

      <div className="editor-content">
        <div className="editor-section">
          <h3>Edit Your Resume</h3>
          <textarea
            className="editor-textarea"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder="Edit your resume text here..."
          />
        </div>

        {extractedSkills.length > 0 && (
          <div className="editor-section">
            <h3>Detected Skills</h3>
            <div className="skills-manager">
              {['technical', 'soft', 'certifications'].map(category => {
                const categorySkills = extractedSkills.filter(s => s.category === category);
                if (categorySkills.length === 0) return null;

                return (
                  <div key={category} className="category-group">
                    <h4>{category.charAt(0).toUpperCase() + category.slice(1)} Skills</h4>
                    <div className="skills-list">
                      {categorySkills.map(({ skill, count }) => (
                        <label key={skill} className="skill-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedSkills.has(skill)}
                            onChange={() => toggleSkill(skill)}
                          />
                          <span className="skill-name">{skill}</span>
                          <span className="skill-count">({count}x)</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="add-skill-section">
              <p>Add custom skill:</p>
              <div className="add-skill-input">
                <input
                  type="text"
                  placeholder="Enter skill name..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkillFromInput(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>

            <div className="editor-actions">
              <button className="save-button" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={onBack}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeEditor;
