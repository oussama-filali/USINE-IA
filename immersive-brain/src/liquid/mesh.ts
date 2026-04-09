export type MeshData = {
  vertices: Float32Array;
  indices: Uint16Array;
  vertexStrideBytes: number;
};

// Creates a subdivided quad in local space.
// Vertex attributes: pos.xy (local -0.5..0.5), uv.xy (0..1)
export function createGridQuad(segments: number): MeshData {
  const s = Math.max(1, Math.floor(segments));
  const vertsPerSide = s + 1;
  const vertexCount = vertsPerSide * vertsPerSide;
  const floatsPerVertex = 4;
  const vertices = new Float32Array(vertexCount * floatsPerVertex);

  let v = 0;
  for (let y = 0; y <= s; y++) {
    const fy = y / s;
    const py = fy - 0.5;
    for (let x = 0; x <= s; x++) {
      const fx = x / s;
      const px = fx - 0.5;
      vertices[v++] = px;
      vertices[v++] = py;
      vertices[v++] = fx;
      vertices[v++] = fy;
    }
  }

  const quadCount = s * s;
  const indexCount = quadCount * 6;
  const indices = new Uint16Array(indexCount);

  let i = 0;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const a = y * vertsPerSide + x;
      const b = a + 1;
      const c = a + vertsPerSide;
      const d = c + 1;
      // two triangles: a-c-b and b-c-d (winding doesn't matter much for 2D)
      indices[i++] = a;
      indices[i++] = c;
      indices[i++] = b;
      indices[i++] = b;
      indices[i++] = c;
      indices[i++] = d;
    }
  }

  return {
    vertices,
    indices,
    vertexStrideBytes: floatsPerVertex * 4,
  };
}
