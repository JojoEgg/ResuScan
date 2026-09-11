import React, { useState } from 'react'
import FileUpload from './src/FileUpload'
import ResumeEditor from './src/ResumeEditor'

function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileSelect = (text) => {
    setResumeText(text);
  };

  const isAnalyzeEnabled = resumeText.trim() !== '' && jobText.trim() !== '';

  const commonWords = new Set([
    'and', 'the', 'for', 'with', 'that', 'this', 'are', 'from', 'have', 'has', 'been', 'were', 'will', 'a', 'an',
    'but', 'can', 'could', 'did', 'does', 'our', 'see', 'should', 'since', 'some', 'than', 'them', 'then', 'there',
    'these', 'they', 'those', 'we', 'what', 'when', 'where', 'which', 'while', 'who', 'why', 'you', 'your', 'is',
    'be', 'as', 'at', 'by', 'to', 'in', 'of', 'on', 'or', 'it', 'as', 'be', 'if', 'no', 'so', 'up', 'us', 'or',
    'position', 'role', 'apply', 'candidate', 'qualification', 'requirement', 'requirements', 'year', 'years',
    'highly', 'us', 'a', 'an', 'we', 'us', 'de', 'the'
  ]);

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
      'bachelor', 'degree', 'masters','computer science', 'software engineering', 'internship', 'academic'
    ]),
  };

  const findRequiredSkills = (text) => {
    const words = text.toLowerCase().match(/\b\w+(?:-\w+)*\b/g) || [];
    const requiredSkills = new Set();
    
    const requirementPatterns = [
      /\b(?:must|should|required to|need to)\s+have\b/i,
      /\brequired\b/i,
      /\bmandatory\b/i,
      /\bessential\b/i,
      /\bkey\s+(?:skill|requirement)s?\b/i
    ];

    const sentences = text.split(/[.!?]+/);
    sentences.forEach(sentence => {
      if (requirementPatterns.some(pattern => pattern.test(sentence))) {
        words.forEach(word => {
          if (!commonWords.has(word)) {
            Object.values(skillCategories).forEach(category => {
              if (category.has(word)) {
                requiredSkills.add(word);
              }
            });
          }
        });
      }
    });

    return Array.from(requiredSkills);
  };

  const categorizeKeyword = (word) => {
    for (const [category, skills] of Object.entries(skillCategories)) {
      if (skills.has(word)) {
        return category;
      }
    }
    return 'other';
  };

  const extractSkills = (text) => {
    const lowerText = text.toLowerCase();
    const skills = [];

    for (const [category, skillSet] of Object.entries(skillCategories)) {
      skillSet.forEach(skill => {
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        let match;
        while ((match = regex.exec(lowerText)) !== null) {
          skills.push({ skill: skill.toLowerCase(), category });
        }
      });
    }

    return skills;
  };

  const analyzeKeywords = () => {
    const jobSkills = extractSkills(jobText);
    const resumeSkills = extractSkills(resumeText);
    const resumeSkillsSet = new Set(resumeSkills.map(s => s.skill));

    const skillFreq = {};
    jobSkills.forEach(({ skill, category }) => {
      if (!skillFreq[skill]) {
        skillFreq[skill] = { count: 0, category };
      }
      skillFreq[skill].count += 1;
    });

    const requiredSkills = findRequiredSkills(jobText);
    const categorizedKeywords = {
      matching: {
        technical: [],
        soft: [],
        certifications: [],
        other: []
      },
      missing: {
        technical: [],
        soft: [],
        certifications: [],
        other: []
      }
    };

    Object.entries(skillFreq).forEach(([skill, { count, category }]) => {
      const isMatching = resumeSkillsSet.has(skill);
      const isRequired = requiredSkills.includes(skill);

      const skillObj = {
        word: skill,
        frequency: count,
        required: isRequired
      };

      if (isMatching) {
        categorizedKeywords.matching[category].push(skillObj);
      } else {
        categorizedKeywords.missing[category].push(skillObj);
      }
    });

    const matchPercentage = Math.round(
      (Object.values(categorizedKeywords.matching).flat().length /
        (Object.values(categorizedKeywords.matching).flat().length +
          Object.values(categorizedKeywords.missing).flat().length)) *
        100
    ) || 0;

    setAnalysisResults({
      ...categorizedKeywords,
      matchPercentage,
      requiredSkills
    });
  };

  const handleEditorSave = (updatedResumeText) => {
    setResumeText(updatedResumeText);
    setIsEditing(false);
  };

  const handleOpenEditor = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <>
        <div className="header">
          <h1><img src="/Logo.svg" alt="resume logo" className="logo"/>ResuScan</h1>
        </div>
        <ResumeEditor
          resumeText={resumeText}
          onBack={() => setIsEditing(false)}
          onSave={handleEditorSave}
        />
      </>
    );
  }

  return (
    <>
      <div className="header">
        <h1><img src="/Logo.svg" alt="resume logo" className="logo"/>ResuScan</h1>
        <p4></p4>
      </div>

      <div className="description">
        <h2>Optimize your resume for job applications</h2>
        <p>Upload your resume and job description to see how well they would match. Get instant feedback on keywords to increase chances to pass the ATS!</p>
      </div>

      <div className="textBox-contain">
        <div className="project-card">
          <h3>Resume</h3>
          <p2>Upload your resume</p2>
          <FileUpload onFileSelect={handleFileSelect} />
          <p2>Or paste your resume here:</p2>
          <textarea className="resume-box" rows="6" cols="45" placeholder="Paste your resume here..." 
            value={resumeText} 
            onChange={(e) => setResumeText(e.target.value)}
          ></textarea>
        </div>

        <div className="project-card">
          <h3>Job Description</h3>
          <p2>Insert the Job Description here!</p2>
          <textarea className="job-box" rows="6" cols="45" placeholder="Paste the job description here..."
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
          ></textarea>
          <button 
            className="analyze-prop"
            id="analyzeBtn"
            disabled={!isAnalyzeEnabled}
            onClick={analyzeKeywords}
          >
            Analyze
          </button>
        </div>

        {analysisResults && (
          <div className="project-card results-card">
            <div className="results-header">
              <h3>Analysis Results</h3>
              <button className="edit-button" onClick={handleOpenEditor}>
                Edit Resume
              </button>
            </div>
            <div className="match-score">
              <h4>Match Score: {analysisResults.matchPercentage}%</h4>
            </div>
            
            {analysisResults.requiredSkills.length > 0 && (
              <div className="keywords-section">
                <h4>Required Skills</h4>
                <div className="keywords-list">
                  {analysisResults.requiredSkills.map(skill => (
                    <span key={skill} className="keyword-tag required">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {['technical', 'soft', 'certifications', 'other'].map(category => (
              <div key={category} className="keywords-section">
                <h4>{category.charAt(0).toUpperCase() + category.slice(1)} Skills</h4>
                <div className="keywords-list">
                  {analysisResults.matching[category].map(({ word, frequency, required }) => (
                    <span key={word} className={`keyword-tag matching ${required ? 'required' : ''}`}>
                      {word} ({frequency}x)
                    </span>
                  ))}
                  {analysisResults.missing[category].map(({ word, frequency, required }) => (
                    <span key={word} className={`keyword-tag missing ${required ? 'required' : ''}`}>
                      {word} ({frequency}x)
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default App