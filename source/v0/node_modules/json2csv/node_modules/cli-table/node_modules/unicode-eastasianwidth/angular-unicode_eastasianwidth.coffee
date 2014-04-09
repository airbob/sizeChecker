"use strict"


isEmpty = (value) ->
  angular.isUndefined(value) or value is "" or value is null or value isnt value

int = (str) ->
  parseInt(str, 10)


angular.module("unicode_eastasianwidth", [
])

.directive("eastAsianWidth",
->
  require: "ngModel"
  restrict: "A"
  link: (scope, iElement, iAttrs, controller) ->
    maxlength = int(iAttrs.ngMaxlength or iAttrs.maxlength)
    maxLengthValidator = (value) ->
      if not isEmpty(value) and unicodeEastAsianWidth.width(value) > maxlength
        controller.$setValidity("maxlength", false)
        return undefined
      else
        controller.$setValidity("maxlength", true)
        return value
    controller.$parsers.push(maxLengthValidator)
    controller.$formatters.push(maxLengthValidator)
    return
)

.filter("truncate", [
  "length",

(length) ->
  length = int(length)
  (value) ->
    unicodeEastAsianWidth.truncate(value, length, "…")
])

.factory "hasEm", ->
  unicodeEastAsianWidth.hasEm
