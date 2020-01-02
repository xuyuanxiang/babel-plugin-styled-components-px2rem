export const px2rem = `
function %%px2rem%%(%%input%%) {
    if (typeof %%input%% === 'function') return %%px2rem%%(%%input%%());
    var value = typeof %%input%% === 'string' ? parseFloat(%%input%%) : typeof %%input%% === 'number' ? %%input%% : 0;
    var pixels = Number.isNaN(value) ? 0 : value;
    if (pixels < %%minPixelValue%%) {
        return \`\${pixels}px\`;
    }
    var mul = Math.pow(10, %%unitPrecision%% + 1);
    return \`\${(Math.round(Math.floor(((pixels * %%multiplier%%) / %%rootValue%%) * mul) / 10) * 10) / mul}rem\`;
}
`
