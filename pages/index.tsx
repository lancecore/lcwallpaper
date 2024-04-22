import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Logo from "../components/Logo";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import { useGlitch } from 'react-powerglitch'

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);
  
  const logoGlitch = useGlitch({
      "playMode": "always",
      "createContainers": true,
      "hideOverflow": true,
      "timing": {
        "duration": 2500
      },
      "glitchTimeSpan": {
        "start": 0.1,
        "end": 0.25
      },
      "shake": {
        "velocity": 25,
        "amplitudeX": 0.1,
        "amplitudeY": 0.15
      },
      "slice": {
        "count": 8,
        "velocity": 8,
        "minHeight": 0.02,
        "maxHeight": 0.2,
        "hueRotate": true
      },
      "pulse": false
    });
    
    const hoverGlitch = useGlitch({
        "playMode": "hover",
        "createContainers": true,
        "hideOverflow": true,
        "timing": {
          "duration": 250,
          "iterations": 1
        },
        "glitchTimeSpan": {
          "start": 0,
          "end": 1
        },
        "shake": false,
        "slice": {
          "count": 6,
          "velocity": 15,
          "minHeight": 0.02,
          "maxHeight": 0.15,
          "hueRotate": true
        },
        "pulse": false
      });
      
      const nameGlitch = useGlitch({
          "playMode": "hover",
          "createContainers": true,
          "hideOverflow": false,
          "timing": {
            "duration": 250,
            "iterations": 1
          },
          "glitchTimeSpan": {
            "start": 0,
            "end": 1
          },
          "shake": {
            "velocity": 15,
            "amplitudeX": 0.2,
            "amplitudeY": 0.2
          },
          "slice": {
            "count": 6,
            "velocity": 15,
            "minHeight": 0.02,
            "maxHeight": 0.15,
            "hueRotate": true
          },
          "pulse": false
        });

  return (
    <>
      <Head>
        <title>⚡️Lancecore: Weird Wallpapers for your Phone</title>
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="columns-1 gap-4 md:columns-4">
          <div className="after:content relative mb-5 flex h-auto flex-col justify-center items-center gap-4 overflow-hidden rounded-lg bg-white/10 px-6 py-12 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight">
            <span ref={logoGlitch.ref}><Logo className="h-24 w-auto" /></span>
            <h1 className="mb-4 mt-8 text-lg font-bold uppercase tracking-widest">
              Weird Wallpapers<br />for your Phone
            </h1>
            <p className="text-sm text-stone-400">Created by <a href="https://lanceboer.com/" target="_blank" ref={nameGlitch.ref} className="text-stone-300 hover:text-stone-50 underline decoration-stone-400 underline-offset-4 decoration-solid hover:decoration-wavy">Lance Boer</a></p>
            <p className="text-sm text-stone-400">Previously on... <a href="https://bastards.tumblr.com/" target="_blank" ref={nameGlitch.ref} className="text-stone-300 hover:text-stone-50 underline decoration-stone-400 underline-offset-4 decoration-solid hover:decoration-wavy">Stand Up For Bastards</a></p>
          </div>
          {images.map(({ id, public_id, format, blurDataUrl }) => (
            <span ref={hoverGlitch.ref} key={id}>
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-auto cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Weird Wallpaper"
                className="aspect-[9/19.5] transform rounded-lg transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
            </span>
          ))}
          <p>Test</p>
          <p>Test 2</p>
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12"></footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("created_at", "desc")
    .max_results(400)
    .execute();
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}
