import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
} from "webgi";
import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pane } from "tweakpane";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ scroller: ".mainContainer" });

async function setupViewer() {
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas"),
    useRgbm: false,
    isAntialiased: true,
  });
  viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1);

  window.onload = function() {
    // Hide the loader after 3 seconds
    setTimeout(function() {
      document.querySelector('.loader').style.display = 'none';
      document.querySelector('.website-content').style.display = 'block';
    }, 3000); // 3 seconds
  }
  
  const manager = await viewer.addPlugin(AssetManagerPlugin);
  const camera = viewer.scene.activeCamera;

  // Add plugins individually.
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  // await viewer.addPlugin(new TonemapPlugin(true));
  await viewer.addPlugin(SSRPlugin);
  await viewer.addPlugin(SSAOPlugin);
  await viewer.addPlugin(BloomPlugin);

  // WEBGi loader
  const importer = manager.importer;

  importer.addEventListener("onProgress", (ev) => {
    const progressRatio = ev.loaded / ev.total;
    document
      .querySelector(".progress")
      ?.setAttribute("style", `transform: scaleX(${progressRatio})`);
  });

  importer.addEventListener("onLoad", (ev) => {
    introAnimation();
  });

  viewer.renderer.refreshPipeline();
  const model = await manager.addFromPath("./assets/scene (5).glb");
  const object3d = model[0].modelObject;
  const modelPosition = object3d.position;
  const modelRotation = object3d.rotation;
  const modelScale = object3d.scale;

  // Function to adjust model scale based on screen width
  function adjustModelScale() {
    if (window.innerWidth <= 786) {
      modelScale.set(0.5, 0.5, 0.5);
      
      // Scale to 0.2 for screen widths 786px or less
    } else {
      modelScale.set(1, 1, 1); // Reset to original scale if width is greater than 786px
    }
  }

  // Initial scale adjustment
  adjustModelScale();

  // Adjust scale on window resize
  window.addEventListener('resize', adjustModelScale);

  const loaderElement = document.querySelector(".loader");

  function introAnimation() {
    const introTL = gsap.timeline();
    introTL
      .to(".loader", {
        x: "150%",
        duration: 0.8,
        ease: "power4.inOut",
        delay: 1,
        onComplete: () => {
          setupScrollanimation();
          // Make sure the first section content stays visible
          gsap.set(".section.first", { opacity: 1, visibility: "visible" });
        },
      });
  }
  
  function setupScrollanimation() {
    document.body.removeChild(loaderElement);
  
    const isMobile = window.innerWidth <= 768; // Check if it's a mobile screen
  
    const tl = gsap.timeline();
  
    const positionConfig = isMobile
      ? {
          first: { x: -0.5, y: -0.3, z: 0.2 }, // Mobile positions
          second: { x: -0.0, y: 0, z: -0.1 },
          third: { x: 0.5, y: -0.1, z: -0.9 },
          fourth: { x: -0.2, y: -0.25, z: 0.5 },
          fifth: { x: -0.6, y: -0.1, z: 0.2 },
          sixth: { x: 0.9, y: -0.2, z: -0.4 }
        }
      : {
          first: { x: -0.9, y: -0.43, z: 0 }, // Desktop positions
          second: { x: 0.36, y: -0.02, z: -0.22 },
          third: { x: 1.38, y: -0.11, z: -1.06 },
          fourth: { x: -0.92, y: -0.31, z: 0.66 },
          fifth: { x: -1.1, y: -0.11, z: 0.99 },
          sixth: { x: 1.16, y: -0.3, z: -0.56 }
        };
  
    // Animation timeline based on screen size
    tl.to(modelPosition, {
      x: positionConfig.first.x,
      y: positionConfig.first.y,
      z: positionConfig.first.z,
      scrollTrigger: {
        trigger: ".first",
        start: "top top",
        end: "top top",
        scrub: 0.2,
        immediateRender: false,
      },
      onUpdate,
    })
      .to(modelPosition, {
        x: positionConfig.second.x,
        y: positionConfig.second.y,
        z: positionConfig.second.z,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(modelRotation, {
        x: 1.57,
        y: 0,
        z: 0,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
      })
      .to(modelPosition, {
        x: positionConfig.third.x,
        y: positionConfig.third.y,
        z: positionConfig.third.z,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(modelRotation, {
        x: 1.0,
        y: 0.957,
        z: -0.421,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
      })
      .to(modelPosition, {
        x: positionConfig.fourth.x,
        y: positionConfig.fourth.y,
        z: positionConfig.fourth.z,
        scrollTrigger: {
          trigger: ".four",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(modelRotation, {
        x: 0.0,
        y: 1.641,
        z: 0,
        scrollTrigger: {
          trigger: ".four",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
      })
      .to(modelPosition, {
        x: positionConfig.fifth.x,
        y: positionConfig.fifth.y,
        z: positionConfig.fifth.z,
        scrollTrigger: {
          trigger: ".five",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(modelRotation, {
        x: -0.785,
        y: 2.329,
        z: 0.903,
        scrollTrigger: {
          trigger: ".five",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
      })
      .to(modelScale, {
        x: 0.8,
        y: 0.8,
        z: 0.8,
        scrollTrigger: {
          trigger: ".five",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
      })
      .to(modelPosition, {
        x: positionConfig.sixth.x,
        y: positionConfig.sixth.y,
        z: positionConfig.sixth.z,
        scrollTrigger: {
          trigger: ".six",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(modelRotation, {
        x: -0.261,
        y: 4.911,
        z: -0.277,
        scrollTrigger: {
          trigger: ".six",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
      });
  
    // Ensure text is visible in all sections, including mobile
    gsap.to(".section--six--container", {
      opacity: 1, // Make sure it's visible
      scrollTrigger: {
        trigger: ".section--six--container",
        start: "top 80%",
        end: "bottom center",
        scrub: true,
        immediateRender: false,
      },
    });
  
    // Container animations for all sections
    gsap.to(".section--one--container1", {
      opacity: 1, // Ensure text visibility
      scrollTrigger: {
        trigger: ".section--one--container1",
        start: "top top",
        end: "bottom top",
        scrub: true,
        immediateRender: false,
      },
    });
  
    gsap.to(".section--one--container2", {
      opacity: 1, // Ensure text visibility
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "top center",
        scrub: true,
        immediateRender: false,
      },
    });
  
    gsap.to(".section--two--container1", {
      scrollTrigger: {
        trigger: ".section--two--container1",
        start: "top 80%",
        end: "bottom center",
        toggleClass: "resetPosition", // Ensures the container resets its position properly
        scrub: true,
      },
    });
  
    gsap.to(".section--two--container2", {
      scrollTrigger: {
        trigger: ".section--two--container2",
        start: "top 80%",
        end: "bottom center",
        toggleClass: "resetPosition", // Ensures the container resets its position properly
        scrub: true,
      },
    });
  
    gsap.to(".section--three--container", {
      scrollTrigger: {
        trigger: ".section--three--container",
        start: "top 80%",
        end: "bottom center",
        toggleClass: "resetPosition", // Ensures the container resets its position properly
        scrub: true,
      },
    });
  
    gsap.to(".section--four--container", {
      scrollTrigger: {
        trigger: ".section--four--container",
        start: "top 80%",
        end: "bottom center",
        toggleClass: "resetPosition", // Ensures the container resets its position properly
        scrub: true,
      },
    });
  
    gsap.to(".section--five--container", {
      scrollTrigger: {
        trigger: ".section--five--container",
        start: "top 80%",
        end: "bottom center",
        toggleClass: "resetPosition", // Ensures the container resets its position properly
        scrub: true,
      },
    });
  
    gsap.to(".section--six--container", {
      scrollTrigger: {
        trigger: ".section--six--container",
        start: "top 80%",
        end: "bottom center",
        toggleClass: "resetPosition", // Ensures the container resets its position properly
        scrub: true,
      },
    });
  }
  
  // WEBGI UPDATE
  let needsUpdate = true;
  function onUpdate() {
    needsUpdate = true;
    viewer.renderer.resetShadows();
    viewer.setDirty();
  }

  // SCROLL TO TOP
  document.querySelectorAll(".button--footer")?.forEach((item) => {
    item.addEventListener("click", () => {
      const container = document.getElementsByClassName("mainContainer");
      container[0].scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  });
}

setupViewer();
