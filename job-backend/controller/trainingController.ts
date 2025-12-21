import { Request, Response } from "express";

export const getTrainings = async (req: Request, res: Response) => {
    const dummyTrainings = [
        {
            id: 1,
            title: "Full Stack Web Development",
            description: "Learn to build modern web applications using MERN stack.",
            instructor: "John Doe",
            duration: "12 Weeks",
            price: "$999",
            startDate: "2024-02-01",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        },
        {
            id: 2,
            title: "Digital Marketing Masterclass",
            description: "Master the art of digital marketing, SEO, and social media strategies.",
            instructor: "Jane Smith",
            duration: "8 Weeks",
            price: "$599",
            startDate: "2024-02-15",
            image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80"
        },
        {
            id: 3,
            title: "Data Science with Python",
            description: "Analyze data and build machine learning models using Python.",
            instructor: "Alice Johnson",
            duration: "16 Weeks",
            price: "$1299",
            startDate: "2024-03-01",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        },
        {
            id: 4,
            title: "Graphic Design Fundamentals",
            description: "Learn the basics of graphic design using Adobe Creative Cloud.",
            instructor: "Bob Brown",
            duration: "6 Weeks",
            price: "$499",
            startDate: "2024-02-10",
            image: "https://images.unsplash.com/photo-1626785774573-4b799312299d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        },
        {
            id: 5,
            title: "Project Management PMP",
            description: "Comprehensive preparation for the PMP certification exam.",
            instructor: "Sarah Lee",
            duration: "10 Weeks",
            price: "$899",
            startDate: "2024-03-10",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        },
        {
            id: 6,
            title: "Cyber Security Essentials",
            description: "Introduction to network security and ethical hacking.",
            instructor: "Mike Wilson",
            duration: "12 Weeks",
            price: "$1099",
            startDate: "2024-02-20",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        }
    ];

    res.status(200).json({
        success: true,
        count: dummyTrainings.length,
        data: dummyTrainings,
    });
};
