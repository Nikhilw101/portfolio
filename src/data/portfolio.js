// Portfolio Data - Nikhil Vilas Wagh

export const personalInfo = {
    name: 'Nikhil',
    title: 'Aspiring Software Engineer',
    location: 'Pune, Maharashtra',
    email: 'nwagh008@gmail.com',
    phone: '+91-8767432720',
    github: 'https://github.com/nikhilw101/',
    linkedin: 'https://www.linkedin.com/in/nikhil-wagh-2155282ab/',
    leetcode: 'https://leetcode.com/u/Nikhilw101/',
    resume: 'https://drive.google.com/file/d/1rETQnU6Yxl7H6O6A3woBGn4OKNJkKVhH/view?usp=sharing'
};

export const aboutText = {
    intro: "I'm a B.Tech student at Vishwakarma Institute of Technology, Pune, with a strong interest in web development. I enjoy building clean, user-focused web applications and often integrate AI features where they add real value. I like working on practical projects that solve real-world problems."
};

export const education = [
    {
        institution: 'Vishwakarma Institute Of Technology, Pune',
        degree: 'B.Tech in AIDS',
        score: 'CGPA: 8.96',
        duration: '2024 – 2027',
        location: 'Pune, India'
    },
    {
        institution: 'Government Polytechnic, Nashik',
        degree: 'Diploma in Computer Technology',
        score: 'Percentage: 91.47%',
        duration: '2021 – 2024',
        location: 'Nashik, India'
    },
    {
        institution: 'Swami Muktanand Vidyalaya, Yeola',
        degree: 'SSC',
        score: 'Percentage: 96.00%',
        duration: '2020 – 2021',
        location: 'Yeola, India'
    }
];

export const projects = [
    // 1 — Kidney Stone Classification
    {
        title: 'Kidney Stone Classification & Grad-CAM Detection',
        year: '2025',
        description: 'End-to-end medical imaging pipeline that detects kidney stones from CT scans using DenseNet121. Achieves 93.6% validation accuracy with patient-level data splitting to prevent leakage.',
        tech: 'Grad-CAM heatmaps provide visual explainability — highlighting the exact kidney region influencing each prediction. Deployed as a Streamlit web app for real-time image upload and inference.',
        stack: ['Python', 'PyTorch', 'DenseNet121', 'Grad-CAM', 'Streamlit', 'scikit-learn'],
        github: 'https://github.com/Nikhilw101/Kedney_Stone_Classification_-_Gradcamp_detection',
        live: null
    },
    // 2 — RAG Voice Assistant
    {
        title: 'RAG-Based Real-Time Voice Assistant',
        year: '2026',
        description: 'Real-time AI voice assistant using Groq Whisper for transcription, Groq LLM with Vector RAG for context-aware responses, and ElevenLabs TTS for speech synthesis.',
        tech: 'Built low-latency REST APIs and WebSocket streaming for real-time, multilingual voice interactions from a custom knowledge dataset.',
        stack: ['Python', 'Groq API', 'Vector RAG', 'WebSocket', 'ElevenLabs', 'REST API'],
        github: 'https://github.com/Nikhilw101/RAG-Based-Real-Time-Voice-Assistant',
        live: null
    },
    // 3 — HomeSync
    {
        title: 'HomeSync — AI-Powered Flatmate & Rental Matching Platform',
        year: '2026',
        description: 'Full-stack rental/flatmate matching platform that connects property owners with compatible tenants using a hybrid AI + rule-engine Fit Score (out of 100). Calculates real geographic distance via the Haversine formula and hard-filters listings outside the configured search radius.',
        tech: 'Dual-engine design: Google Gemini 1.5 Flash for nuanced AI scoring with a deterministic rule engine as fallback. Real-time owner-tenant chat via Socket.io. Smart email notifications (Brevo) for high-compatibility matches (≥80%).',
        stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Gemini AI', 'Socket.io', 'JWT', 'Cloudinary'],
        github: 'https://github.com/Nikhilw101/flatmate-finder',
        live: 'https://homesync-rent.vercel.app/'
    },
    // 4 — E-Commerce
    {
        title: 'Grape Master – E-commerce Web Application',
        year: '2025',
        description: 'Full-stack e-commerce platform for fresh grape sales with complete product, order, and user management. Stripe payment integration, automated email notifications, and a role-based admin panel.',
        tech: 'Secure admin panel with CRUD for products, categories, users, and orders. Scalable REST APIs for cart, checkout, order tracking, and analytics.',
        stack: ['Node.js', 'Express.js', 'React', 'MongoDB', 'Stripe API', 'REST API', 'Admin Dashboard'],
        github: 'https://github.com/Nikhilw101/GrapeMasterWeb',
        live: 'https://grape-master.vercel.app/'
    },
    // 5 — Sentiment Analysis
    {
        title: 'YouTube Comment Sentiment Analysis',
        year: '2025',
        description: 'Sentiment analysis system that categorizes YouTube video comments using mBERT. Visualizes sentiment trends and distributions via an interactive React dashboard.',
        tech: 'Multilingual BERT model handles comments across languages. Sentiment categories and trend charts rendered in a clean React UI.',
        stack: ['Python', 'mBERT', 'React.js', 'NLP', 'Data Visualization'],
        github: 'https://github.com/Nikhilw101/Sentiment_analysis_front',
        live: 'https://sentiment-analysis-front.vercel.app/'
    },
    // 6 — Book Recommendation
    {
        title: 'Book Recommendation Platform',
        year: '2025',
        description: 'Web platform for discovering books from a large free collection. Provides personalized recommendations using content-based filtering with TF-IDF to improve the discovery experience.',
        tech: 'TF-IDF content-based recommendations match books to user reading history and preferences. Clean search and browsing experience with a full-stack architecture.',
        stack: ['Python', 'TF-IDF', 'Recommendation System', 'React.js', 'Web Application'],
        github: 'https://github.com/Nikhilw101/book_Recomm_backend',
        live: 'https://book-recomm-platform.vercel.app/'
    },
    // 7 — Pitch Deck Extractor
    {
        title: 'Pitch Deck Extractor',
        year: '2025',
        description: 'Production-oriented monorepo for extracting, structuring, and analysing PDF/PPTX pitch decks. Produces structured section data, signals, red flags with evidence, confidence scores, and summaries. Supports semantic deck search and PDF report export.',
        tech: 'Rust/Axum backend handles all extraction and LLM orchestration via Ollama. Cohere embeddings power HNSW vector search. React + Vite frontend for upload, report review, and PDF export.',
        stack: ['Rust', 'Axum', 'Tokio', 'Ollama', 'Cohere', 'HNSW', 'React', 'Vite', 'MongoDB'],
        github: 'https://github.com/Nikhilw101/pitch_deck_extraction',
        live: null
    }
];

export const publications = [
    {
        type: 'Journal Paper',
        title: 'VidTextBot using Generative AI',
        venue: 'JISEM Journal',
        year: '2025',
        description: 'Published research paper in JISEM Journal on building a generative AI-powered video text bot.',
        authors: 'Nikhil Wagh et al.',
        link: 'https://jisem-journal.com/index.php/journal/article/view/2894'
    },
    {
        type: 'Conference Paper',
        title: 'Book Recommendation Platform using AI',
        venue: 'Springer International Conference',
        year: '2025',
        description: 'Conference paper published in Springer on an AI-driven book recommendation system.',
        authors: 'Nikhil Wagh et al.',
        link: 'https://link.springer.com/chapter/10.1007/978-3-032-06694-7_44'
    },
    {
        type: 'Patent',
        title: 'A Real-Time Multilingual Voice Assistant System with Edge-Based Audio Signal Processing and Interactive Dashboard for Intelligent Institutional Communication',
        venue: 'Intellectual Property India',
        year: '2026',
        description: 'Ordinary Patent Application filed with the Indian Patent Office (Electronics field). Application Number: 202021034469. Publication Date (U/S 11A): 15/05/2026.',
        authors: 'Surabhi Kakade, Radhika Gadewar, Akanksha Katore, Nikhil Wagh, Aryan Sable, Sufiyan Sajan',
        applicationNumber: '202021034469',
        filingDate: '29/04/2026',
        publicationDate: '15/05/2026',
        fieldOfInvention: 'Electronics',
        link: 'https://drive.google.com/file/d/1UXDSoBd6CJyBRXxhYG6NL3_vVH0sQ-cA/view?usp=sharing'
    }
];

export const experience = {
    company: 'Sumago Infotech',
    role: 'WebDev Intern',
    duration: 'Jan 2024 – May 2024',
    location: 'Nashik, India',
    responsibilities: [
        'Built responsive UI components in React.js',
        'Worked with backend APIs',
        'Collaborated on full-stack development projects'
    ]
};

export const skills = {
    categories: [
        {
            name: 'Languages',
            icon: 'Code2',
            items: ['Java', 'C/C++', 'Python', 'JavaScript', 'Rust']
        },
        {
            name: 'Frontend',
            icon: 'Layout',
            items: ['React.js', 'Vite', 'HTML', 'CSS', 'Tailwind']
        },
        {
            name: 'Backend',
            icon: 'Server',
            items: ['Node.js', 'Express.js', 'Flask', 'Axum', 'Socket.io']
        },
        {
            name: 'Database',
            icon: 'Database',
            items: ['MySQL', 'MongoDB', 'MongoDB Atlas', 'Vector DB']
        },
        {
            name: 'AI / ML',
            icon: 'Brain',
            items: ['Machine Learning', 'Deep Learning', 'RAG', 'Vector Search', 'NLP', 'Gemini AI', 'Ollama', 'Cohere']
        },
        {
            name: 'Tools',
            icon: 'Wrench',
            items: ['VS Code', 'Postman', 'GitHub', 'Vercel', 'Cloudinary', 'Docker']
        },
        {
            name: 'Coursework',
            icon: 'BookOpen',
            items: ['OOPS Concept', 'Computer Network', 'Operating System', 'DBMS', 'Web Development']
        }
    ]
};

export const achievements = [
    {
        title: 'Avinya 3.0 Hackathon',
        position: 'Runner-up',
        details: 'Built an AI-powered EdTech platform using Flask, ReactJS, and MongoDB. Competed against 150+ teams.',
        date: 'Feb 2025',
        location: 'Pune, India'
    },
    {
        title: '2 Fast 2 Hack Hackathon, Symbiosis (SIT) Pune',
        position: 'Top 10 Finalists',
        details: 'Ranked among the top 10 out of 200+ teams after multiple evaluation rounds.',
        date: 'Mar 2025',
        location: 'Pune, India'
    },
    {
        title: 'Adobe India Hackathon',
        position: 'Cleared 1st Round',
        details: 'Among 2.5 lakh participants across India, 80,000 were shortlisted for Round 1, and I successfully cleared it.',
        date: 'Aug 2025',
        location: 'Online'
    }
];

export const ctaText = {
    message: "Let's build something great together",
    primaryButton: 'Get in Touch',
    secondaryButton: 'View Resume'
};

export const contactText = {
    message: "Feel free to reach out for collaborations, opportunities, or just a friendly tech conversation."
};

export const footer = {
    copyright: '© 2026 Nikhil Wagh. Built with precision.'
};
