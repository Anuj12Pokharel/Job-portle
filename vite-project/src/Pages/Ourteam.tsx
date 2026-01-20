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
  return (
    <div className="w-72 h-[420px] perspective group">
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
          className="absolute inset-0 border-2 border-cyan-500 rounded-lg bg-white text-center p-5"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={image}
            alt={name}
            className="w-32 h-32 mx-auto mt-5 rounded-lg object-cover"
          />
          <h3 className="mt-4 text-2xl font-bold text-cyan-500">{name}</h3>
          <p className="mt-2 text-gray-700">{bio}</p>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rotate-y-180 border-2 border-cyan-500 rounded-lg bg-white text-center p-5"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <h3 className="text-2xl font-bold text-cyan-500">About</h3>
          <p className="mt-4 text-gray-700 text-sm">{bio}</p>
          <button className="mt-6 w-12 h-12 bg-cyan-500 text-white text-2xl rounded-md">
            +
          </button>
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
