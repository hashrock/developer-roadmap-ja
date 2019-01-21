const LOCALSTORAGE_KEY = "developer-roadmap-ja";
Vue.component("box", {
  template: `
  <g :transform="transform">
    <rect :fill="fillColor" stroke="black" stroke-width="2" x=0 y=0 width="300" height="40"></rect>
    <a :href="link">
      <text x=150 y=20 dominant-baseline="central" text-anchor="middle">{{label}}</text>
    </a>
    <rect class="box__checkbox" @click="check" fill="white" stroke="black" x=5 y=5 width=20 height=20>
    </rect>
    <path class="box__checkmark" v-if="checked" fill="none" stroke="blue" stroke-width="3" d="M 7,17 L 10,20 L 20,10"></path>
  </g>
  `,
  props: {
    x: Number,
    y: Number,
    label: String,
    type: String,
    storage: Array
  },
  methods: {
    check() {
      const idx = this.storage.indexOf(this.label);
      if (idx >= 0) {
        this.storage.splice(idx, 1);
      } else {
        this.storage.push(this.label);
      }
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.storage));
    }
  },
  computed: {
    transform() {
      return `translate(${this.x}, ${this.y})`;
    },
    fillColor() {
      if (this.type === "parent") {
        return "#FFFF00";
      }
      return "#FFE599";
    },
    link() {
      return `https://scrapbox.io/developer-roadmap-ja/${this.label}`;
    },
    checked() {
      return this.storage.includes(this.label);
    }
  }
});

Vue.component("tree", {
  template: `<div>
  <svg style="margin: 0rem 1rem 2rem 1rem" width="680" :height="height" :viewBox="viewBox">
    <g v-for="(item, idx) in children">
      <path stroke-linecap="round" fill="none" stroke-width=3 stroke="blue" stroke-dasharray="0.1,10" :d="curve(idx)"></path>
      <box :storage="storage" :x="360" :y="idx * 60" :label="item"></box>
      <line x1=300 y1=20 x2=360 :y2="20 + 60 * idx"></line>
    </g>
    <box :storage="storage" :x="0" :y="0" :label="label" type="parent"></box>
  </svg>
  </div>`,
  props: {
    label: String,
    children: Array,
    storage: Array
  },
  methods: {
    curve(idx) {
      return `M 300,20 C 330,20 330,${20 + 60 * idx} 360,${20 + 60 * idx}`;
    }
  },
  computed: {
    height() {
      if (!this.children) {
        return 60;
      }
      return this.children.length * 60;
    },
    viewBox() {
      return `0 0 680 ${this.height}`;
    }
  }
});

Vue.component("tree-section", {
  template: `
  <div>
    <h1>{{treedata.title}}</h1>
    <div v-for="item in treedata.tree">
      <tree :storage="storage" :label="item.label" :children="item.children"></tree>
    </div>
  </div>
  `,
  props: {
    storage: Array,
    treedata: Object
  }
});

new Vue({
  el: "#app",
  data: {
    storage: [],
    roadmaps: {}
  },
  mounted() {
    fetch("./roadmaps.json")
      .then(i => i.json())
      .then(d => {
        this.roadmaps = d;
      });

    const local = localStorage.getItem(LOCALSTORAGE_KEY);
    if (local) {
      this.storage = JSON.parse(local);
    }
  }
});
