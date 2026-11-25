import { LoopingVideo } from "./LoopingVideo";

const photos = [
  { area: "house", src: "/origen-rebros-house-exterior.avif", width: 1440, height: 1080, alt: "Casa Origen Liencres con su jardín al atardecer", caption: "La casa y el jardín" },
  { area: "shala", src: "/origen-casa-shala.webp", width: 720, height: 540, alt: "Shala cubierta de madera con vistas al paisaje costero de Liencres", caption: "La shala" },
  { area: "salon", src: "/origen-casa-salon.webp", width: 720, height: 540, alt: "Salón común y cocina abierta bajo vigas de madera", caption: "El salón y la cocina" },
] as const;

export function VenueShowcase() {
  return (
    <section className="venue-showcase" id="fotos" aria-labelledby="venue-showcase-title">
      <header>
        <p className="retreat-public-eyebrow">El espacio · Liencres</p>
        <h2 id="venue-showcase-title">La casa en imágenes.</h2>
      </header>
      <div className="venue-showcase-grid">
        {photos.map(({ area, src, width, height, alt, caption }) => (
          <figure key={src} className={`venue-showcase-${area}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} width={width} height={height} alt={alt} loading="lazy" decoding="async" />
            <figcaption>{caption}</figcaption>
          </figure>
        ))}
        <figure className="venue-showcase-video">
          <LoopingVideo
            aria-label="Vídeo del espacio Origen Liencres"
            src="/origen-home-video.mp4"
            poster="/origen-home-video-poster.jpg"
            width={720}
            height={1280}
          >
            <a href="/origen-home-video.mp4">Abrir el vídeo de Origen</a>
          </LoopingVideo>
        </figure>
      </div>
    </section>
  );
}
