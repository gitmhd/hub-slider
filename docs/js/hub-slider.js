// Defining HUBSlider class
class HUBSlider {
   constructor() {
      // HUBSlider properties
      HUBSlider.version = "v1.0.0";

      this.animateSlide = true;
      this.selectable = `
        *:not(.arrows-holder,
            .bullets-holder,
            .hub-prevent,
            :empty)
         `;
   }

   init(sliderId) {
      this.slider = document.getElementById(sliderId);
      this.slides = Array(
         ...document.querySelectorAll(`#${sliderId} > ${this.selectable}`)
      );
      this.createReq();
      this.triggerArrows();
   }

   createElement(parent, element, num) {
      let node = null,
         nodes = [];
      if (num) {
         for (let i = 1; i <= num; i += 1) {
            nodes.push(parent.appendChild(document.createElement(element)));
         }
      } else {
         node = parent.appendChild(document.createElement(element));
      }

      return node || nodes;
   }

   appendElement(parent, child) {
      if (Array.isArray(child)) {
         for (let i = 0; i < child.length; i += 1) {
            parent.appendChild(child[i]);
         }
      } else {
         parent.appendChild(child);
      }
   }

   removeClasses(el, classes, fn) {
      for (let i = 0; i < classes.length; i += 1) {
         if (el.classList.contains(classes[i])) {
            el.classList.remove(classes[i]);
         }
      }
      fn ? fn() : null;
   }

   addClasses(el, classes, fn) {
      for (let i = 0; i < classes.length; i += 1) {
         el.classList.add(classes[i]);
      }
      fn ? fn() : null;
   }

   isExist(parent, className) {
      for (let i = 0; i < parent.children.length; i += 1) {
         let el = parent.children[i];

         if (el.classList.contains(className)) {
            return true;
         } else if (i === parent.children.length - 1) {
            return false;
         }
      }
   }

   getIndex(parent, element) {
      return Array(...parent.children).indexOf(element);
   }

   syncBullets() {
      for (let i = 0; i < this.slides.length; i += 1) {
         this.slides[i].classList.contains("active")
            ? this.addClasses(this.bullets[i], ["active"])
            : this.removeClasses(this.bullets[i], ["active"]);
      }
   }

   triggerArrows() {
      this.nextArrow.addEventListener("click", () => {
         this.toNext();
      });
      this.prevArrow.addEventListener("click", () => {
         this.toPrev();
      });
   }

   triggerBullets() {
      this.syncBullets();

      this.bullets.forEach((bullet) => {
         bullet.addEventListener("click", () => {
            this.slideTo(bullet);
         });
      });
   }

   createReq() {
      this.createArrows();
      this.createBullets();

      this.slidingPrev = "from-left";
      this.slidingNext = "from-right";

      this.autoSlide();
   }

   createArrows() {
      if (!this.isExist(this.slider, "arrows-holder")) {
         this.arrowsHolder = this.createElement(this.slider, "ul");
         this.nextArrow = this.createElement(this.arrowsHolder, "li");
         this.prevArrow = this.createElement(this.arrowsHolder, "li");

         this.appendElement(this.slider, this.arrowsHolder);
         this.appendElement(this.arrowsHolder, this.prevArrow);
         this.appendElement(this.arrowsHolder, this.nextArrow);
         this.addClasses(this.arrowsHolder, ["arrows-holder"]);
      } else {
         this.arrowsHolder = this.slider.querySelector(".arrows-holder");
         this.nextArrow = this.arrowsHolder.querySelectorAll("li")[1];
         this.prevArrow = this.arrowsHolder.querySelectorAll("li")[0];
      }
   }

   createBullets() {
      if (!this.isExist(this.slider, "bullets-holder")) {
         this.bulletsHolder = this.createElement(this.slider, "ul");
         this.bullets = this.createElement(
            this.slider,
            "li",
            this.slides.length
         );
         this.addClasses(this.bulletsHolder, ["bullets-holder"]);
         this.appendElement(this.bulletsHolder, this.bullets);
         this.triggerBullets();
      } else {
         this.bulletsHolder = this.slider.querySelector(".bullets-holder");
         this.bullets = Array(...this.bulletsHolder.children);
         this.triggerBullets();
      }
   }

   slideTo(bullet) {
      let activeBullet = this.bulletsHolder.querySelector(".active"),
         activeIndex = this.getIndex(this.bulletsHolder, activeBullet),
         bulletIndex = this.getIndex(this.bulletsHolder, bullet),
         slide = this.slides[bulletIndex];

      for (let i = 0; i < this.slides.length; i += 1) {
         this.removeClasses(this.slides[i], [
            "active",
            this.slidingNext,
            this.slidingPrev,
         ]);
      }

      this.removeClasses(activeBullet, ["active"]);
      this.addClasses(bullet, ["active"]);

      bulletIndex > activeIndex
         ? this.addClasses(slide, ["active", this.slidingNext])
         : this.addClasses(slide, ["active", this.slidingPrev]);

      this.stopAnimation();
   }

   toNext() {
      let slide;
      for (let i = 0; i < this.slides.length; i += 1) {
         slide = this.slides[i];
         if (
            slide.classList.contains("active") &&
            this.slides[this.slides.indexOf(slide) + 1] !== undefined
         ) {
            this.removeClasses(slide, [
               "active",
               this.slidingNext,
               this.slidingPrev,
            ]);
            this.addClasses(this.slides[this.slides.indexOf(slide) + 1], [
               "active",
               this.slidingNext,
            ]);
            break;
         } else if (
            slide.classList.contains("active") &&
            this.slides[this.slides.indexOf(slide) + 1] === undefined
         ) {
            this.removeClasses(slide, [
               "active",
               this.slidingNext,
               this.slidingPrev,
            ]);
            this.addClasses(this.slides[0], ["active", this.slidingNext]);
         }
      }
      this.syncBullets();
      this.stopAnimation();
   }

   toPrev() {
      let slide;
      for (let i = 0; i < this.slides.length; i += 1) {
         slide = this.slides[i];
         if (
            slide.classList.contains("active") &&
            this.slides[this.slides.indexOf(slide) - 1] !== undefined
         ) {
            this.removeClasses(slide, [
               "active",
               this.slidingPrev,
               this.slidingNext,
            ]);
            this.addClasses(this.slides[this.slides.indexOf(slide) - 1], [
               "active",
               this.slidingPrev,
            ]);
            break;
         } else if (
            slide.classList.contains("active") &&
            this.slides[this.slides.indexOf(slide) - 1] === undefined
         ) {
            this.removeClasses(slide, [
               "active",
               this.slidingPrev,
               this.slidingNext,
            ]);
            this.addClasses(this.slides[this.slides.length - 1], [
               "active",
               this.slidingPrev,
            ]);
            break;
         }
      }
      this.syncBullets();
      this.stopAnimation();
   }

   arrowsRemStyle(which) {
      switch (which) {
         case "next":
            this.nextArrow.classList.add("remove-arrows-style");
            break;
         case "prev":
            this.prevArrow.classList.add("remove-arrows-style");
            break;
         case "both":
            this.nextArrow.classList.add("remove-arrows-style");
            this.prevArrow.classList.add("remove-arrows-style");
      }
   }

   autoSlide(speed) {
      clearInterval(this.interval);

      if (typeof speed === "number") {
         this.interval = setInterval(() => {
            this.toNext();
            // this.autoSlide();
         }, speed);
      } else {
         this.interval = setInterval(() => {
            this.toNext();
            // this.autoSlide();
         }, 5000);
      }
   }

   stopAnimation() {
      let classes = [
            ".hub-left",
            ".hub-right",
            ".hub-top",
            ".hub-bottom",
            ".hub-fade",
            ".fast",
            ".faster",
            ".slow",
            ".slower",
            ".meduim",
            ".delay-1",
            ".delay-2",
            ".delay-3",
            ".delay-4",
            ".delay-5",
         ],
         classArr = [];

      // Pushes all items of classes array into classArr
      classes.forEach((clas) => {
         clas = clas.replace(".", "");
         classArr.push(clas);
      });

      if (this.animateSlide === false) {
         if (this.slides.length !== 0) {
            for (let i = 0; i < this.slides.length; i += 1) {
               this.removeClasses(this.slides[i], classArr);
            }
         }
      }
   }

   arrowsColor(color) {
      this.nextArrow.style.borderRightColor = color || "var(--main-color)";
      this.nextArrow.style.borderBottomColor = color || "var(--main-color)";
      this.prevArrow.style.borderRightColor = color || "var(--main-color)";
      this.prevArrow.style.borderBottomColor = color || "var(--main-color)";
   }

   slidingStyle(prev, next) {
      this.slidingPrev = prev || "hub-left";
      this.slidingNext = next || "hub-right";
   }

   options(options) {
      // Sliding style
      this.slidingStyle(options.slidingPrev, options.slidingNext);

      // Arrows color
      this.arrowsColor(options.arrowsColor);

      // Arrows default style option
      this.arrowsRemoveStyle = options.arrowsRemoveStyle || null;

      this.arrowsRemoveStyle === "next"
         ? this.arrowsRemStyle("next")
         : this.arrowsRemoveStyle === "prev"
         ? this.arrowsRemStyle("prev")
         : this.arrowsRemoveStyle === "both"
         ? this.arrowsRemStyle("both")
         : null;

      // interval Option
      typeof options.interval === "number"
         ? this.autoSlide(options.interval)
         : null;

      // stopAnimation option
      options.animateSlide === false
         ? (this.animateSlide = false)
         : (this.animateSlide = true);

      // Auto slide option
      options.autoSlide === false ? clearInterval(this.interval) : null;
   }
}
