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
      modelScale.set(0.5, 0.5, 0.5); // Scale to 0.2 for screen widths 786px or less
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

    const tl = gsap.timeline();

    tl.to(modelPosition, {
      x: -0.9,
      y: -0.43,
      z: 0,
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
        x: -0.36,
        y: -0.02,
        z: -0.22,
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
        x: 0.2,
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
        x: 1.38,
        y: -0.11,
        z: -1.06,
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
        x: -0.92,
        y: -0.31,
        z: 0.66,
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
        x: -1.1,
        y: -0.11,
        z: 0.99,
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
      .to(modelScale, {    // Add scale adjustment
        x: 0.8,            // Reduce size along x-axis (80% of original size)
        y: 0.8,            // Reduce size along y-axis
        z: 0.8,            // Reduce size along z-axis
        scrollTrigger: {
          trigger: ".five",
          start: "top bottom",
          end: "top top",
          scrub: 0.2,
          immediateRender: false,
        },
      })

      .to(modelPosition, {
        x: 1.16,
        y: -0.3,
        z: -0.56,
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
      })
      .to(".section--one--container1", {
        opacity: 0,
        scrollTrigger: {
          trigger: ".section--one--container1",
          start: "top top",
          end: "bottom top",
          scrub: true,
          immediateRender: false,
        },
      })

      .to(".section--one--container2", {
        opacity: 0,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top center",
          scrub: true,
          immediateRender: false,
        },
      })
      .to(".section--two--container1", {
        scrollTrigger: {
          trigger: ".section--two--container1",
          start: "top 80%",
          end: "bottom center",
          toggleClass: "activeRightSpecific",
          scrub: true,
        },
      })
      .to(".section--two--container2", {
        scrollTrigger: {
          trigger: ".section--two--container2",
          start: "top 80%",
          end: "bottom center",
          toggleClass: "resetPosition",
          scrub: true,
        },
      })
      .to(".section--three--container", {
        scrollTrigger: {
          trigger: ".section--three--container",
          start: "top 80%",
          end: "bottom center",
          toggleClass: "resetPosition",
          scrub: true,
        },
      })
      .to(".section--four--container", {
        scrollTrigger: {
          trigger: ".section--four--container",
          start: "top 80%",
          end: "bottom center",
          toggleClass: "resetPosition",
          scrub: true,
        },
      })
      .to(".section--five--container ", {
        scrollTrigger: {
          trigger: ".section--five--container ",
          start: "top 80%",
          end: "bottom center",
          toggleClass: "resetPosition",
          scrub: true,
        },
      })
      .to(".section--six--container ", {
        scrollTrigger: {
          trigger: ".section--six--container ",
          start: "top 80%",
          end: "bottom center",
          toggleClass: "resetPosition",
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
