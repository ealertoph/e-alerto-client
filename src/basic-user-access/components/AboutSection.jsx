import { Cpu, MapPin, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-20 px-4 relative bg-section transition-colors duration-300"
    >
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }} // animate once when 30% visible
        >
          About <span className="text-primary">E-Alerto</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-2xl font-semibold">
              AI-Powered Road Issue Reporting Platform for QCitizens
            </h3>
            <p className="text-muted-foreground">
              E-Alerto is a smart reporting system developed under the Quezon
              City Department of Engineering (QCDE) to empower QCitizens in
              reporting road-related infrastructure issues. The platform bridges
              the gap within QC stakeholders by integrating digital solutions
              for a QCitizen-powered city.
            </p>
            <p className="text-muted-foreground">
              By connecting citizens and local agencies through technology,
              E-Alerto supports proactive maintenance, safer roads, and stronger
              civic participation in Quezon City.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center items-center">
              <a href="#contact" className="cosmic-button">
                Get In Touch
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            {[
              {
                icon: <Cpu className="h-6 w-6 text-primary" />,
                title: "AI-powered Image Processing",
                text: "Uses computer vision to automatically detect and classify types of road damage in submitting photographic reports.",
              },
              {
                icon: <MapPin className="h-6 w-6 text-primary" />,
                title: "Geo-tagging & Mapping",
                text: "Accurately tags report locations using GPS to help QCDE respond to the issues based on geospatial data.",
              },
              {
                icon: <ClipboardList className="h-6 w-6 text-primary" />,
                title: "Track Your Reports",
                text: "Monitor the status of your reports from submission to resolution—fostering transparency and public trust.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="gradient-border p-6 card-hover"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
