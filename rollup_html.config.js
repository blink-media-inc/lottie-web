import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import ifdef from 'rollup-plugin-ifdef';
import babel from '@rollup/plugin-babel';
import {version} from './package.json'

const injectVersion = (options = {}) => {
  return {
    name: 'inject-version',
    renderChunk: (code) => {
      return code.replace('[[BM_VERSION]]', version)
    },
  }
}

const addNavigatorValidation = (options = {}) => {
  return {
    name: 'inject-version',
    renderChunk: (code) => {
      return '(typeof navigator !== "undefined") && '  + code
    },
  }
}

const noTreeShakingForStandalonePlugin = () => {
  return {
    name: 'no-treeshaking-for-standalone',
    transform(code) {
        // This is very fast but can produce lots of false positives.
        // Use a good regular expression or parse an AST and analyze scoping to improve as needed.
        if (code.indexOf('__[STANDALONE]__') >= 0) return {moduleSideEffects: 'no-treeshake'};
    }
  }
}

const destinationBuildFolder = 'build/player/';

const builds = [
  {
    input: 'player/js/modules/svg.js',
    dest: `${destinationBuildFolder}`,
    file: 'lottie-player.js',
  },
];

const plugins = [
  ifdef({
  	INCLUDE_SLOTS: false,
  	INCLUDE_AUDIO: false,
  	INCLUDE_ADVANCED: false,
  }),
  nodeResolve(),
  babel({
    babelHelpers: 'runtime',
    skipPreflightCheck: true,
  }),
  // noTreeShakingForStandalonePlugin(),
  injectVersion(),
  addNavigatorValidation(),
  terser({
  	compress: {
  		passes: 2,
  		toplevel: true,
  		drop_console: true
  	},
  	mangle: {
  		toplevel: true,
  		properties: {
  			regex: /.*/,
  			reserved: [
  				"lottie",
  				"loadAnimation",
  				"_shouldRoundValues",
  				"sourceRectAtTime",
  				"layers",
  				"ks",
  				"shapes",
  				"ip",
  				"op",
  				"a",
  				"d",
  				"g",
  				"l",
  				"r",
  				"a",
  				"m",
  				"p",
  				"s",
  				"t",
  				"f",
  				"fc",
  				"nm",
  				"mn",
  				"mc",
  				"xe",
  				"ne",
  				"b",
  				"rn",
  				"sh",
  				"o",
  				"sm",
  				"e",
  				"ss",
  				"sb",
  				"so",
  				"fh",
  				"fs",
  				"fb",
  				"fo",
  				"bl",
  				"ti",
  				"to",
  				"sk",
  				"sa",
  				"x",
  				"y",
  				"z",
  				"c",
  				"v",
  				"i",
  				"h",
  				"ddd",
  				"fr",
  				"w",
  				"rs",
  				"comps",
  				"fonts",
  				"chars",
  				"meta",
  				"mf",
  				"metadata",
  				"sc",
  				"markers",
  				"mb",
  				"slots",
  				"tc",
  				"spf",
  				"asl",
  				"cm",
  				"tm",
  				"dr",
  				"hd",
  				"ty",
  				"ind",
  				"parent",
  				"sr",
  				"sw",
  				"of",
  				"s",
  				"lh",
  				"sz",
  				"ps",
  				"j",
  				"ca",
  				"tr",
  				"ls",
  				"st",
  				"tt",
  				"td",
  				"masksProperties",
  				"ef",
  				"sy",
  				"ao",
  				"tp",
  				"hasMask",
  				"bm",
  				"cl",
  				"ln",
  				"tg",
  				"cp",
  				"ct",
  				"vj",
  				"inv",
  				"mode",
  				"pt",
  				"pe",
  				"ix",
  				"rc",
  				"el",
  				"fl",
  				"gf",
  				"gs",
  				"no",
  				"gr",
  				"rp",
  				"rd",
  				"pb",
  				"mm",
  				"tw",
  				"zz",
  				"or",
  				"os",
  				"ir",
  				"is",
  				"lc",
  				"lj",
  				"ml",
  				"ml2",
  				"n",
  				"np",
  				"eo",
  				"u",
  				"xt",
  				"xl",
  				"xf",
  				"id",
  				"eo",
  				"en",
  				"ch",
  				"ga",
  				"ll",
  				"hm",
  				"hc",
  				"ho",
  				"in",
  				"re",
  				"al",
  				"it",
  				"assets",
  				"refId",
  				"sid",
  				"ascent",
  				"fFamily",
  				"fWeight",
  				"fStyle",
  				"fPath",
  				"fName",
  				"origin",
  				"fClass",
  				"fOrigin",
  				"u",
  				"k",
  				"animationData",
  				"container",
  				"renderer",
  				"layer",
  				"effects",
  				"comp",
  				"shape",
  				"text",
  				"footage",
  				"hasParent",
  				"anchorPoint",
  				"anchor_point",
  				"zRotation",
  				"xRotation",
  				"yRotation",
  				"xPosition",
  				"yPosition",
  				"zPosition",
  				"skew",
  				"skewAxis",
  				"props",
  				"cix"
  			]
  		}
  	},
  	output: {
  		comments: false
  	}
  }),
]

const exports = builds.reduce((acc, build) => {
  const builds = [];
  builds.push({
  	treeshake: true,
    plugins: plugins,
    input: build.input,
    output: {
      format: 'umd',
      name: 'lottie',
      esModule: false,
      exports: 'default',
      sourcemap: false,
      compact: true,
      file: `${build.dest}${build.file}`,
    }
  });
  
  acc = acc.concat(builds);
  return acc;
}, []);
export default exports;
