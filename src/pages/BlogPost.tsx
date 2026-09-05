import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Seo, breadcrumbJsonLd } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { company, posts } from "@/content/site";
import { formatDate } from "@/lib/utils";

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((item) => item.slug === slug);

  if (!post) return <Navigate to="/404" replace />;

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={"/blog/" + post.slug}
        type="article"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            keywords: post.tags.join(", "),
            author: { "@type": "Organization", name: company.legalName },
            publisher: { "@type": "Organization", name: company.legalName },
          },
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: "/blog/" + post.slug },
          ]),
        ]}
      />

      <PageHero
        eyebrow={formatDate(post.publishedAt) + " · " + post.readingTime}
        title={post.title}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: "/blog/" + post.slug },
        ]}
      />

      <article className="section">
        <div className="container max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="soft">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="mt-8 text-xl text-muted-foreground">{post.excerpt}</p>

          <div className="mt-8 space-y-6 text-lg leading-relaxed">
            {post.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <Button asChild variant="ghost" className="mt-12 px-0">
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back to all articles
            </Link>
          </Button>
        </div>
      </article>
    </>
  );
}
