"use strict"


describe "east-asian-width", ->

  beforeEach ->
    module "unicode_eastasianwidth"

  describe "width", ->

    it "should counting text chars", inject(($rootScope, $compile) ->
      scope = $rootScope
      $compile("""
         <form name="form">
           <input name="text" east-asian-width maxlength='5' type='text' ng-model="text">
         </form>
      """)(scope)
      input = scope.form.text
      scope.$apply ->
        input.$setViewValue "aaaaaa"
        expect(input.$modelValue).toBe(undefined)

        input.$setViewValue "あいう"
        expect(input.$modelValue).toBe(undefined)

        input.$setViewValue "aaaaa"
        expect(input.$modelValue).toBe("aaaaa")

        input.$setViewValue "aaaあ"
        expect(input.$modelValue).toBe("aaaあ")
    )

  describe "truncate", ->

    beforeEach(module(($provide) ->
      $provide.value "length", "5"
      return
    ))

    it "should truncate text", inject((truncateFilter) ->
      expect(truncateFilter("aaaaaa")).toEqual("aaa…")
      expect(truncateFilter("あああ")).toEqual("あ…")
      expect(truncateFilter("aaaaa")).toEqual("aaaaa")
      expect(truncateFilter("aaaあ")).toEqual("aaaあ")
      expect(truncateFilter("")).toEqual("")
    )

  describe "hasEm", ->

    it "should return hasEm", inject((hasEm) ->
      expect(hasEm("aaああ")).toEqual true
      expect(hasEm("aa")).toEqual false
    )
