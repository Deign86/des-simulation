// Convert hex string to bit array (0|1)
export function hexToBits(hex: string): number[] {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
  const bits: number[] = [];
  for (const char of cleanHex) {
    const num = parseInt(char, 16);
    for (let i = 3; i >= 0; i--) {
      bits.push((num >> i) & 1);
    }
  }
  return bits;
}

// Convert bit array to hex string
export function bitsToHex(bits: number[]): string {
  let hex = '';
  for (let i = 0; i < bits.length; i += 4) {
    const chunk = bits.slice(i, i + 4);
    let val = 0;
    for (let j = 0; j < 4; j++) {
      val = (val << 1) | (chunk[j] || 0);
    }
    hex += val.toString(16).toUpperCase();
  }
  return hex;
}

// Permute bits using table (1-indexed DES tables)
export function permute(bits: number[], table: readonly number[]): number[] {
  return table.map(pos => bits[pos - 1]);
}

// XOR two bit arrays of equal length
export function xorBits(a: number[], b: number[]): number[] {
  return a.map((bit, i) => bit ^ b[i]);
}

// Left rotate bit array by n positions
export function leftRotate(bits: number[], n: number): number[] {
  const len = bits.length;
  const shift = n % len;
  return [...bits.slice(shift), ...bits.slice(0, shift)];
}

// S-Box lookup for 6-bit input
export function sboxLookup(input6: number[], sbox: number[][]): { output4: number[], row: number, col: number } {
  const row = (input6[0] << 1) | input6[5]; // bits 1 and 6 (1-indexed)
  const col = (input6[1] << 3) | (input6[2] << 2) | (input6[3] << 1) | input6[4]; // bits 2-5
  const val = sbox[row][col];
  const output4 = [
    (val >> 3) & 1,
    (val >> 2) & 1,
    (val >> 1) & 1,
    val & 1
  ];
  return { output4, row, col };
}
