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
    resume: 'https://drive.google.com/file/d/18V_CW_db4FG1R1sf9vgxNOM5otVQFHY3/view?usp=sharing'
};

export const aboutText = {
    intro: "I'm a B.Tech student at Vishwakarma Institute of Technology, Pune, with a strong interest in web development. I enjoy building clean, user-focused web applications and often integrate AI features where they add real value. I like working on practical projects that solve real-world problems."
};

export const education = [
    {
        institution: 'Vishwakarma Institute Of Technology, Pune',
        degree: 'B.Tech in AIDS',
        score: 'CGPA: 8.88',
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
    {
        title: 'RAG-Based Real-Time Voice Assistant',
        year: '2025',
        description: 'Developed a real-time AI voice assistant using Groq Whisper, Groq LLM with Vector RAG, and ElevenLabs TTS to generate context-aware responses from a custom dataset.',
        tech: 'Built low-latency REST APIs and WebSocket streaming to support real-time, multilingual voice interactions.',
        stack: ['Python', 'Groq API', 'Vector RAG', 'WebSocket', 'REST API'],
        github: 'https://github.com/Nikhilw101/RAG-Based-Real-Time-Voice-Assistant',
        live: null
    },
    {
        title: 'ForumHub – Open Discussion Platform',
        year: '2025',
        description: 'Developed a web-based open discussion platform where users can start conversations on any topic and share images or videos.',
        tech: 'The platform includes role-based access with separate admin and user modules, enabling controlled CRUD operations for posts, users, and reported content. Designed to support real-time community interaction with a clean, scalable architecture focused on usability and moderation.',
        stack: ['React.js', 'Node.js', 'MongoDB', 'REST API', 'CRUD'],
        github: 'https://github.com/Nikhilw101/ForumHub',
        live: null
    },
    {
        title: 'CakeStake – Web-Based Cake Recommendation System',
        year: '2025',
        description: 'Built a web platform to recommend products with personalized suggestions, ratings, and an admin-controlled CRUD system for managing products and users.',
        tech: 'Full-stack development with modern web technologies.',
        stack: ['React.js', 'Node.js', 'MongoDB', 'REST API'],
        github: null,
        live: null
    },
    {
        title: 'Book Recommendation Platform',
        year: '2025',
        description: 'Developed a web-based platform that allows users to search from a large collection of free books.',
        tech: 'The system provides personalized book recommendations based on user reading history and preferences using basic recommendation techniques. Implemented a content-based recommendation approach using TF-IDF to suggest relevant books and improve the discovery experience.',
        stack: ['Python', 'TF-IDF', 'Recommendation System', 'Web Application'],
        github: 'https://github.com/Nikhilw101/book_Recomm_backend',
        live: 'https://book-recomm-platform.vercel.app/'
    },
    {
        title: 'YouTube Comment Sentiment Analysis',
        year: '2025',
        description: 'Implemented a sentiment analysis system to analyze YouTube video comments using mBERT.',
        tech: 'The platform categorizes sentiments and visualizes trends using a React-based dashboard.',
        stack: ['Python', 'mBERT', 'React.js', 'NLP', 'Data Visualization'],
        github: 'https://github.com/Nikhilw101/Sentiment_analysis_front',
        live: 'https://sentiment-analysis-front.vercel.app/'
    },
    {
        title: 'OS Simulator – Operating System Concepts Visualizer',
        year: '2025',
        description: 'Developed an interactive simulator to demonstrate core operating system functionalities and concepts.',
        tech: 'The project visually explains how different OS components work, making complex topics easier to understand for students. Designed as an educational tool to bridge the gap between theory and practical understanding of operating systems.',
        stack: ['Computer Networks', 'Operating Systems', 'Simulation', 'Educational Tool'],
        github: null,
        live: null
    }
];

export const publications = [
    {
        type: 'Journal Paper',
        title: 'Published Research Paper',
        venue: 'JISEM Journal',
        year: '2025',
        link: 'https://jisem-journal.com/index.php/journal/article/view/2894'
    },
    {
        type: 'Conference Paper',
        title: 'Published Research Paper',
        venue: 'Springer',
        year: '2025',
        link: 'https://link.springer.com/chapter/10.1007/978-3-032-06694-7_44'
    },
    {
        type: 'Patent',
        title: 'Patent Filing',
        venue: 'Intellectual Property',
        year: '2025',
        link: 'https://drive.google.com/file/d/1r02fnWbOy9xpPf_iGsvUDh01F4HjkVZg/view?usp=sharing'
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
            items: ['Java', 'C/C++', 'Python', 'JavaScript']
        },
        {
            name: 'Frontend',
            icon: 'Layout',
            items: ['React.js', 'HTML', 'CSS']
        },
        {
            name: 'Backend',
            icon: 'Server',
            items: ['Node.js', 'Flask']
        },
        {
            name: 'Database',
            icon: 'Database',
            items: ['MySQL', 'MongoDB']
        },
        {
            name: 'Tools',
            icon: 'Wrench',
            items: ['VS Code', 'Postman', 'GitHub', 'Vercel']
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
    copyright: '© 2025 Nikhil Wagh. Built with precision.'
};
