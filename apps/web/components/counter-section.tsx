"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "Export", label: "Accompagnement jusqu'a la livraison" },
  { value: "Guide", label: "Achat securise et documents clairs" },
  { value: "WhatsApp", label: "Contact commercial direct" },
  { value: "Catalogue", label: "Camions, tracteurs et utilitaires" }
];

export function CounterSection() {
  return (
    <section className="section-spacing">
      <div className="container-premium grid gap-6 md:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="rounded-3xl border bg-white p-8 text-center shadow-premium dark:bg-zinc-900"
          >
            <p className="font-serif text-5xl font-bold gradient-text">{item.value}</p>
            <p className="mt-3 text-sm text-zinc-500">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
