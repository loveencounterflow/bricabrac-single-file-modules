(function() {
  'use strict';
  //===========================================================================================================
  Object.assign(module.exports, require('./various-brics'));

  Object.assign(module.exports, require('./ansi-brics'));

  Object.assign(module.exports, {
    unstable: {...(require('./unstable-brics')), ...(require('./unstable-benchmark-brics')), ...(require('./unstable-fast-linereader-brics')), ...(require('./unstable-getrandom-brics')), ...(require('./unstable-callsite-brics'))}
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUEsYUFBQTs7RUFHQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixPQUFBLENBQVEsaUJBQVIsQ0FBOUI7O0VBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsT0FBQSxDQUFRLGNBQVIsQ0FBOUI7O0VBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEI7SUFBRSxRQUFBLEVBQVUsQ0FDeEMsR0FBQSxDQUFFLE9BQUEsQ0FBUSxrQkFBUixDQUFGLENBRHdDLEVBRXhDLEdBQUEsQ0FBRSxPQUFBLENBQVEsNEJBQVIsQ0FBRixDQUZ3QyxFQUd4QyxHQUFBLENBQUUsT0FBQSxDQUFRLGtDQUFSLENBQUYsQ0FId0MsRUFJeEMsR0FBQSxDQUFFLE9BQUEsQ0FBUSw0QkFBUixDQUFGLENBSndDLEVBS3hDLEdBQUEsQ0FBRSxPQUFBLENBQVEsMkJBQVIsQ0FBRixDQUx3QztFQUFaLENBQTlCO0FBTEEiLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc3RyaWN0J1xuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIHJlcXVpcmUgJy4vdmFyaW91cy1icmljcydcbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIHJlcXVpcmUgJy4vYW5zaS1icmljcydcbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIHsgdW5zdGFibGU6IHtcbiAgKCByZXF1aXJlICcuL3Vuc3RhYmxlLWJyaWNzJyAgICAgICAgICAgICAgICAgICkuLi4sXG4gICggcmVxdWlyZSAnLi91bnN0YWJsZS1iZW5jaG1hcmstYnJpY3MnICAgICAgICApLi4uLFxuICAoIHJlcXVpcmUgJy4vdW5zdGFibGUtZmFzdC1saW5lcmVhZGVyLWJyaWNzJyAgKS4uLixcbiAgKCByZXF1aXJlICcuL3Vuc3RhYmxlLWdldHJhbmRvbS1icmljcycgICAgICAgICkuLi4sXG4gICggcmVxdWlyZSAnLi91bnN0YWJsZS1jYWxsc2l0ZS1icmljcycgICAgICAgICApLi4uLFxuICB9LCB9XG5cbiJdfQ==
//# sourceURL=../src/main.coffee