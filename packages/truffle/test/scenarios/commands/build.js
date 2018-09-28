const assert = require("assert");
const CommandRunner = require("../commandrunner");
const MemoryLogger = require("../memorylogger");
const sandbox = require("../sandbox");
const fs = require("fs");
const path = require("path");

describe("truffle build", () => {
  const logger = new MemoryLogger();
  let config, project;

  describe("when there is no build script in config", () => {
    beforeEach("set up sandbox", function() {
      this.timeout(10000);
      project = path.join(__dirname, '../../sources/build/projectWithoutBuildScript');
      return sandbox.create(project).then(conf => {
        config = conf;
        config.logger = logger;
      });
    });
    it("whines about having no build config", function(done) {
      CommandRunner.run("build", config, (error) => {
        const output = logger.contents();
        assert(output.includes("No build configuration found."));
        done();
      });
    });
  });

  describe("when there is a build config", () => {
    beforeEach("set up sandbox", function() {
      this.timeout(10000);
      project = path.join(__dirname, '../../sources/build/projectWithBuildScript');
      return sandbox.create(project).then(conf => {
        config = conf;
        config.logger = logger;
      });
    });
    it("runs the build script", function(done) {
      CommandRunner.run("build", config, (error) => {
        const output = logger.contents();
        assert(output.includes("'this is the build script'"));
        done();
      });
    });
  });
});