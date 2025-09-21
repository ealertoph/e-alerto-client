import { assets } from "../../assets/assets";
import { motion } from "framer-motion";

const classifications = [
  {
    id: 1,
    title: "Potholes",
    description:
      "Irregular depressions caused by surface fatigue, indicating structural failure in the pavement layer.",
    image: assets.pothole,
    tags: ["Road Damage", "Pothole Repair", "Safety Hazard"],
  },
  {
    id: 2,
    title: "Cracks",
    description:
      "Includes longitudinal, transverse, and alligator cracks—key indicators of aging or stressed road materials.",
    image: assets.cracks,
    tags: ["Crack Repair", "Road Maintenance", "Surface Damage"],
  },
];

export const ProjectsSection = () => {
  return (
    <section
      id="projects"
      className="py-17 bg-background transition-colors duration-300"
    >
      <div className="text-center px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }} // animate once when 30% visible
        >
          Road Damage <span className="text-primary">Classifications</span>
        </motion.h2>
        <motion.p
          className="text-muted-foreground mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }} // animate once when 30% visible
        >
          These are key road surface damages detectable by AI-based image
          processing. Used in infrastructure monitoring, planning, and
          maintenance automation.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {classifications.map((item) => (
          <div key={item.id} className="flex flex-col">
            <motion.img
              src={item.image}
              alt={item.title}
              className="w-full h-64 sm:h-96 object-cover"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            />
            <div className="py-6 px-6 text-center">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                {item.description}
              </p>
              <div className="flex justify-center flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
