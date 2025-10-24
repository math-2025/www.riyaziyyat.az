import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BarChart, BookOpen, Calculator } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image-1');
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Calculator className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Riyaziyyat Testi</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Daxil ol</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Qeydiyyat <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Riyaziyyat biliklərinizi təkmilləşdirin
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              İmtahanlara hazırlaşın, mövzuları təkrarlayın və nəticələrinizi izləyin. Uğura gedən yol buradan başlayır.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">İndi Başla <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {heroImage && (
            <div className="relative aspect-video max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
              <Image 
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
            </div>
          )}
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Platformanın Üstünlükləri</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Sizə ən yaxşı təcrübəni yaşatmaq üçün hazırlanmış xüsusiyyətlər.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Geniş Sual Bazası</h3>
                <p className="mt-2 text-muted-foreground">Müxtəlif çətinlik səviyyələrində yüzlərlə sual ilə özünüzü sınayın.</p>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  <Calculator className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Ətraflı İzahlar</h3>
                <p className="mt-2 text-muted-foreground">Hər sualın ətraflı izahı ilə səhvlərinizdən öyrənin və mövzuları daha dərindən qavrayın.</p>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  <BarChart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Nəticə Analizi</h3>
                <p className="mt-2 text-muted-foreground">İmtahan nəticələrinizi və zamanla inkişafınızı asanlıqla izləyin.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Riyaziyyat Testi. Bütün hüquqlar qorunur.</p>
      </footer>
    </div>
  );
}
