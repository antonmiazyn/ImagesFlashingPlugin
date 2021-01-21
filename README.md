# ImagesFlashingPlugin
Pure JS Plugin for Images


![ImagesFlashingPlugin](/Untitled-1.png)


All usage recommendations you can also find directly in **index.html** file


## 💪 Get Started

* Connect **flashing_v1.2/flashing.css** file to the `<head>` section of your page. It's an optional step, but you can easily rewrite this styles or connect your own styles for *flashing* elements. But connecting **flashing.css** file is the best way to make your animation to looks perfect

![Css connecting](/screens/screen-1.png)

* Connect **flashing_v1.2/execute.js** file before `</body>` closing tag

![Script connecting](/screens/screen-2.png)

* To define the execution container *(it can be more than one)* create a block element and add class `flashing` to it. Next step is adding special settings attributes (If you forgot (or didn't want) to set your own settings, animation will start working with default settings)
  * `data-theme`: sets the color setting for all images that animation includes. Default: `data-theme='color'`
    1. `color`: all images has no filters
    2. `greyscale`: all images becomes greyscale
    3. `sepia`: all images has sepia filter
  * `data-order`: sets the order of elements output. Default: `data-order='orderly'`
    1. `orderly`: every lap of animation we will see images pausing from first to last and again
    2. `random`: sets random order and repeat this order on each lap
    3. `absolute`: means 'absolutly random' order. Images output order will be different every lap
  * `data-speed`: sets speed of quick images switching before pausing. Default: 1.5 (150ms). *Can't be less than 0*
  * `data-duration`: sets duration of each animation stage. Default: 2 (2s). It's the common value for both: quick switching time and pause time. *The best practice to create the pure animation without any defects is to set speed and duration values equivalen, as an example 1.2 and 2.4*
  
* To define animated elements you should to add the elements with class `flashing-image` to execution container. The best way to do this *(plugin styled for this)* is to create block/flex *(flex as a default)* elements and add images directly inside this elements. *You are also able to add any other tags inside this elements, it may be image's number as an example*.

* To add the animation to any element, you should to create block element inside selected by yourself `flashing-image` block and add him class `flashing-animation`. This block should contain two special attributes with image's url and sprites amount, but if you forgot (or didn't want) to add this attributes, it will be setted by default
  * `data-src`: contains the image's full or relative url. Default: `data-src='sprites-circles.png'`
  * `data-amount`: contains the number of sprites in animation. Default: `data-amount='8'`
  
![Layout](/screens/screen-3.png)
  
* How to make a right spritelist? Spritelist is a wide image, conditionally parted on the sectors with equal width. Each sector contains the stage of animation. For better understading spritelists, check the structure of the **sprites-circles.png** or **sprites-squares.png** file in the root path of this repository


## 🔧 How it works

1. Script finds all `flashing` containers
2. In each of this containers it defines the animated elements
3. Than it sets parametres of the animation (as speed, theme, duration, animation, etc.)
4. Next step is a setting start condition, that makes all elements, besides first, invisible
5. If selected order is `orderly` — script will be filled by default order array from first to last elements indexes
  5.1. If selected order is `random` or `absolute` — script will be filled by random order array with elements indexes in random order. For the `random` order this array will be used every next lap. For the `absolute` order this array will be used only for the first animation lap, and than this array will become useless, instead of it new array will be filled again every next lap
6. Every step, setted by duration attribute's value, function called `swithing` will be started and paused, providing main execution function to show next element in queue. `switching` in this context means that elements will be shown and hidden from first to last for all duration time with speed, setted in `data-speed` attribute


## 💫 Usage Examples

The best usage example of this plugin it's a representation of company/project staff or just interesting animated gallery

## 👁 DEMO

The main feature of this plugin is simple pure js code, without need of using jQuery or any other libraries or frameworks. You can easily customize it for your own needs.
You can see the DEMO following the link: **[ImagesFlashingPlugin | DEMO](https://antonmiazyn.github.io/projects/ImagesFlashingJS(v1.2)/index.html)**

![Demo preview](/screens/screen-4.png)
