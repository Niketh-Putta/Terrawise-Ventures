export default function TrustIndicators() {
  const stats = [
    { value: "50+", label: "Projects Completed", color: "text-primary" },
    { value: "2000+", label: "Happy Families", color: "text-secondary" },
    { value: "15+", label: "Years Experience", color: "text-accent" },
    { value: "100%", label: "Legal Compliance", color: "text-primary" },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-6">
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
