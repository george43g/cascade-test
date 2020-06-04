module.exports = {
  name: 'game-library',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/game-library',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
