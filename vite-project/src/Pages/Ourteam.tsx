import { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


interface TeamMember {
  id: number;
  name: string;
  designation: string;
  image: string;
  bio: string;
}
/*Team card*/
const TeamCard = ({
  name,
  designation,
  image,
  bio,
}: Omit<TeamMember, "id">) => {
  const imageUrl = image ? (image.startsWith('http') ? image : `${API_BASE_URL}/${image.replace(/\\/g, '/')}`) : '';

  return (
    <div className="w-72 min-h-[400px] perspective group">
      <div
        className="
          relative w-full h-full
          transition-transform duration-700 ease-in-out
          transform-style-3d
          group-hover:rotate-y-180
        "
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 border-2 border-cyan-500 rounded-lg bg-white text-center p-5 flex flex-col items-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={imageUrl}
            alt={name}
            className="w-32 h-32 rounded-lg object-cover shadow-md mb-4"
          />
          <h3 className="text-xl font-bold text-cyan-600 leading-tight">{name}</h3>
          <p className="text-sm font-semibold text-cyan-500 mb-2 uppercase tracking-wide">{designation}</p>
          <p className="text-gray-600 text-sm line-clamp-4">{bio}</p>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rotate-y-180 border-2 border-cyan-500 rounded-lg bg-white text-center p-6 flex flex-col items-center justify-center shadow-lg"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <h3 className="text-xl font-bold text-cyan-600 mb-3">About {name.split(' ')[0]}</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>
          <div className="mt-6 w-10 h-10 bg-cyan-500 text-white flex items-center justify-center rounded-full shadow-lg">
            <span className="text-2xl font-bold">+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/*Fetch team members from API*/
const OurTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchTeam = async () => {
      const res = await fetch(`${API_BASE_URL}/api/team/get`);
      const data = await res.json();
      console.log(data);
      setTeam(data);
      setLoading(false);
    };

    fetchTeam();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading team...</p>;
  }

  return (
    
    <div className="px-4 mt-6 mb-10 flex flex-wrap justify-center gap-8">
  {team.map((member) => (
    <TeamCard
      key={member.id}
      name={member.name}
      designation={member.designation}
      image={member.image}
      bio={member.bio}
    />
  ))}
</div>
  );
};

export default OurTeam;
