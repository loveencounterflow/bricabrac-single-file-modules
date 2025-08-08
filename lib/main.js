(function() {
  'use strict';
  //===========================================================================================================
  Object.assign(module.exports, require('./various-brics'));

  Object.assign(module.exports, require('./ansi-brics'));

  Object.assign(module.exports, {
    unstable: {...(require('./unstable-brics')), ...(require('./unstable-benchmark-brics')), ...(require('./unstable-fast-linereader'))}
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUEsYUFBQTs7RUFHQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixPQUFBLENBQVEsaUJBQVIsQ0FBOUI7O0VBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsT0FBQSxDQUFRLGNBQVIsQ0FBOUI7O0VBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEI7SUFBRSxRQUFBLEVBQVUsQ0FDeEMsR0FBQSxDQUFFLE9BQUEsQ0FBUSxrQkFBUixDQUFGLENBRHdDLEVBRXhDLEdBQUEsQ0FBRSxPQUFBLENBQVEsNEJBQVIsQ0FBRixDQUZ3QyxFQUd4QyxHQUFBLENBQUUsT0FBQSxDQUFRLDRCQUFSLENBQUYsQ0FId0M7RUFBWixDQUE5QjtBQUxBIiwic291cmNlc0NvbnRlbnQiOlsiXG4ndXNlIHN0cmljdCdcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCByZXF1aXJlICcuL3ZhcmlvdXMtYnJpY3MnXG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCByZXF1aXJlICcuL2Fuc2ktYnJpY3MnXG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCB7IHVuc3RhYmxlOiB7XG4gICggcmVxdWlyZSAnLi91bnN0YWJsZS1icmljcycgKS4uLixcbiAgKCByZXF1aXJlICcuL3Vuc3RhYmxlLWJlbmNobWFyay1icmljcycgKS4uLixcbiAgKCByZXF1aXJlICcuL3Vuc3RhYmxlLWZhc3QtbGluZXJlYWRlcicgKS4uLixcbiAgfSwgfVxuXG4iXX0=
//# sourceURL=../src/main.coffee