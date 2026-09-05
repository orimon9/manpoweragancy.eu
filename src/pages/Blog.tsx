import { Link } from "react-router-dom";
import { Seo, breadcrumbJsonLd } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { posts } from "@/content/site";
import { formatDate } from "@/lib/utils";

export default function Blog() {
  return (
    <>
      <Seo
        title="News & Immigration Updates"
        description="Policy changes, quota announcements and practical guidance from our immigration consultants."
        path="/blog"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      <PageHero
        eyebrow="Insights"
        title="News & Immigration Updates"
        description="Policy changes, quota announcements and practical guidance from our consultants."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />

      <section className="section">
        <div className="container grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} className="relative flex flex-col transition-shadow hover:shadow-e2">
              <CardContent className="flex flex-1 flex-col p-6 pt-6">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="soft">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h2 className="mt-4 text-lg">
                  <Link to={"/blog/" + post.slug} className="after:absolute after:inset-0">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                <p className="mt-5 text-xs text-muted-foreground">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingTime}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
