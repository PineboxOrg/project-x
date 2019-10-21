module.exports = {
    "modulePathIgnorePatterns": [
        "tmp",
        "<rootDir>/test",
        "<rootDir>/packages",
        "collection/.*/files"
      ],
      "testPathIgnorePatterns": [
        "node_modules",
        "<rootDir>/build/packages/angular/spec"
      ],
      "coverageReporters": [
        "html"
      ],
      "coverageDirectory": "coverage",
      "silent": false,
      "verbose": true
}