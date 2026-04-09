import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, Clock, Tag, ArrowRight, Briefcase } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = await prisma.serviceCategory.findUnique({ where: { slug } });
  
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `${cat.name} | Touch Paradise`,
    description: cat.description,
  };
}

export default async function ServiceCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = await prisma.serviceCategory.findUnique({
    where: { slug },
    include: {
      services: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) notFound();

  return (
    <PageLayout>
      {/* Category Header */}
      <section className="relative py-24 bg-slate-900 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover opacity-30"
              priority
            />
          ) : (
            <div className="w-full h-full bg-slate-800 opacity-50" />
          )}
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-emerald-400 font-semibold mb-6 hover:text-emerald-300 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Services
          </Link>
          <h1 className="text-5xl font-bold mb-6">{category.name}</h1>
          <p className="text-slate-300 max-w-2xl text-lg leading-relaxed">
            {category.description}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          {category.services.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
              <p className="text-slate-500">We are currently updating our {category.name} packages. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.services.map((svc) => {
                const firstImg = svc.images?.split("|")[0];
                return (
                  <Link
                    key={svc.id}
                    href={`/services/${category.slug}/${svc.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all block"
                  >
                    <div className="relative h-64">
                      {firstImg ? (
                        <Image
                          src={firstImg}
                          alt={svc.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                           <Briefcase className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-slate-900 text-xs font-bold shadow-sm">
                        ${svc.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-3">
                        {svc.title}
                      </h3>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                        {svc.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                           {svc.durationDays && (
                             <span className="flex items-center gap-1.5">
                               <Clock className="w-3.5 h-3.5" />
                               {svc.durationDays} Days
                             </span>
                           )}
                           <span className="flex items-center gap-1.5">
                              <Tag className="w-3.5 h-3.5" />
                              Adventure
                           </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
