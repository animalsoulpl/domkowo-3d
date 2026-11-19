// Wspólny silnik zasobów 3D: prawdziwe modele .glb (GLTFLoader + Box3 auto-scale + fallback)
// oraz pełne zestawy tekstur PBR (Diffuse + Normal + Roughness) i RoundedBoxGeometry.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const gltfLoader = new GLTFLoader();
const texLoader = new THREE.TextureLoader();
texLoader.setCrossOrigin('anonymous');

export const MODEL_SOURCES = {
  sofa: {
    local: './models/GlamVelvetSofa.glb',
    cdn: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb',
  },
  chair: {
    local: './models/SheenChair.glb',
    cdn: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb',
  },
  lantern: {
    local: './models/Lantern.glb',
    cdn: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Lantern/glTF-Binary/Lantern.glb',
  },
  camera: {
    local: './models/AntiqueCamera.glb',
    cdn: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
  },
  dish: {
    local: './models/IridescentDishWithOlives.glb',
    cdn: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/IridescentDishWithOlives/glTF-Binary/IridescentDishWithOlives.glb',
  },
};

const TEX_SOURCES = {
  wood: {
    map: ['./textures/wood_diff.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_floor_deck/wood_floor_deck_diff_1k.jpg'],
    normalMap: ['./textures/wood_nor.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_floor_deck/wood_floor_deck_nor_gl_1k.jpg'],
    roughnessMap: ['./textures/wood_rough.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_floor_deck/wood_floor_deck_rough_1k.jpg'],
  },
  brick: {
    map: ['./textures/brick_diff.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/red_brick/red_brick_diff_1k.jpg'],
    normalMap: ['./textures/brick_nor.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/red_brick/red_brick_nor_gl_1k.jpg'],
    roughnessMap: ['./textures/brick_rough.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/red_brick/red_brick_rough_1k.jpg'],
  },
  fabric: {
    map: ['./textures/fabric_diff.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/fabric_pattern_07/fabric_pattern_07_col_1_1k.jpg'],
    normalMap: ['./textures/fabric_nor.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/fabric_pattern_07/fabric_pattern_07_nor_gl_1k.jpg'],
    roughnessMap: ['./textures/fabric_rough.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/fabric_pattern_07/fabric_pattern_07_rough_1k.jpg'],
  },
  marble: {
    map: ['./textures/marble_diff.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/marble_01/marble_01_diff_1k.jpg'],
    normalMap: ['./textures/marble_nor.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/marble_01/marble_01_nor_gl_1k.jpg'],
    roughnessMap: ['./textures/marble_rough.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/marble_01/marble_01_rough_1k.jpg'],
  },
  rock: {
    map: ['./textures/rock_diff.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/rock_boulder_dry/rock_boulder_dry_diff_1k.jpg'],
    normalMap: ['./textures/rock_nor.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/rock_boulder_dry/rock_boulder_dry_nor_gl_1k.jpg'],
    roughnessMap: ['./textures/rock_rough.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/rock_boulder_dry/rock_boulder_dry_rough_1k.jpg'],
  },
  cobble: {
    map: ['./textures/cobble_diff.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/cobblestone_floor_04/cobblestone_floor_04_diff_1k.jpg'],
    normalMap: ['./textures/cobble_nor.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/cobblestone_floor_04/cobblestone_floor_04_nor_gl_1k.jpg'],
    roughnessMap: ['./textures/cobble_rough.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/cobblestone_floor_04/cobblestone_floor_04_rough_1k.jpg'],
  },
};

// ---------- Cache'owana RoundedBoxGeometry dla miękkich krawędzi mebli ----------
const RBOX_CACHE = new Map();
export function roundBoxGeo(w, h, d) {
  const minD = Math.min(w, h, d);
  if (minD < 0.03) return new THREE.BoxGeometry(w, h, d);
  const r = Math.min(minD * 0.2, minD >= 0.08 ? 0.055 : 0.016);
  const k = `${w.toFixed(3)}|${h.toFixed(3)}|${d.toFixed(3)}`;
  if (!RBOX_CACHE.has(k)) RBOX_CACHE.set(k, new RoundedBoxGeometry(w, h, d, 2, r));
  return RBOX_CACHE.get(k);
}

// ---------- Ładowanie tekstur PBR z RepeatWrapping + SRGBColorSpace / NoColorSpace ----------
const texCache = new Map();
function loadTexPair([localUrl, cdnUrl], isColor, rx, ry) {
  const key = `${localUrl}|${rx}x${ry}|${isColor ? 1 : 0}`;
  if (texCache.has(key)) return texCache.get(key);
  const configure = tex => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(rx, ry);
    tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
  };
  const tex = texLoader.load(
    localUrl,
    t => configure(t),
    undefined,
    () => {
      // Fallback na Poly Haven CDN jeśli brak lokalnego pliku
      texLoader.load(cdnUrl, t2 => {
        tex.image = t2.image;
        configure(tex);
      }, undefined, () => {});
    }
  );
  configure(tex);
  texCache.set(key, tex);
  return tex;
}

const pbrMatCache = new Map();
export function getPBRMaterial(kind, { color = '#ffffff', repeat = [2, 2], roughness = 0.82, metalness = 0.02, normalScale = 0.85 } = {}) {
  const [rx, ry] = repeat;
  const key = `${kind}|${color}|${rx}x${ry}|${roughness}|${metalness}|${normalScale}`;
  if (pbrMatCache.has(key)) return pbrMatCache.get(key);
  const src = TEX_SOURCES[kind];
  if (!src) return new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const opts = {
    color,
    roughness,
    metalness,
    map: loadTexPair(src.map, true, rx, ry),
  };
  if (src.normalMap) {
    opts.normalMap = loadTexPair(src.normalMap, false, rx, ry);
    opts.normalScale = new THREE.Vector2(normalScale, normalScale);
  }
  if (src.roughnessMap) {
    opts.roughnessMap = loadTexPair(src.roughnessMap, false, rx, ry);
  }
  const m = new THREE.MeshStandardMaterial(opts);
  pbrMatCache.set(key, m);
  return m;
}

// ---------- Ładowanie i cache'owanie modeli .glb z Box3 auto-scale i fallbackiem ----------
const glbCache = new Map();

function fetchGlb(name) {
  if (glbCache.has(name)) return glbCache.get(name);
  const src = MODEL_SOURCES[name];
  if (!src) return Promise.reject(new Error('Unknown model: ' + name));
  const p = new Promise((resolve, reject) => {
    gltfLoader.load(
      src.local,
      gltf => resolve(gltf.scene),
      undefined,
      () => {
        // Fallback na Khronos CDN jeśli brak lokalnego pliku
        gltfLoader.load(
          src.cdn,
          gltf => resolve(gltf.scene),
          undefined,
          err => reject(err)
        );
      }
    );
  });
  glbCache.set(name, p);
  return p;
}

/**
 * Ładuje model .glb do grupy `parent` z automatycznym skalowaniem przez THREE.Box3,
 * włączeniem cieni (castShadow/receiveShadow), podpięciem userData oraz bezpiecznym fallbackiem proceduralnym.
 */
export function mountGlbModel(parent, {
  name,
  targetSize = [1, 1, 1], // [maxW, maxH, maxD]
  pos = [0, 0, 0],
  rotY = 0,
  userData = null,
  fallbackGroup = null,
  replaceFallback = true,
}) {
  const holder = new THREE.Group();
  holder.position.set(pos[0], pos[1], pos[2]);
  holder.rotation.y = rotY;
  parent.add(holder);

  fetchGlb(name).then(proto => {
    const model = proto.clone(true);
    // Oblicz naturalne wymiary przez THREE.Box3 i automatycznie przeskaluj do targetSize
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const sx = size.x > 0.0001 ? targetSize[0] / size.x : 1;
    const sy = size.y > 0.0001 ? targetSize[1] / size.y : 1;
    const sz = size.z > 0.0001 ? targetSize[2] / size.z : 1;
    const s = Math.min(sx, sy, sz);
    model.scale.setScalar(s);
    // Wyśrodkuj w XZ i postaw podstawę dokładnie na y = 0
    model.position.set(-center.x * s, -box.min.y * s, -center.z * s);
    model.traverse(o => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (userData) Object.assign(o.userData, userData);
      }
    });
    holder.add(model);
    if (replaceFallback && fallbackGroup) {
      fallbackGroup.visible = false;
    }
  }).catch(() => {
    // Fallback: ulepszony mebel proceduralny pozostaje widoczny — żadne miejsce nie zostaje puste!
    if (fallbackGroup) fallbackGroup.visible = true;
  });

  return holder;
}
