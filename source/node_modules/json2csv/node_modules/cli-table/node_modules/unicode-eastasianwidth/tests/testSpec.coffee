"use strict"

describe "Unicode EastAsianWidth", ->

  width = unicodeEastAsianWidth.width
  binaryRangeSearch = unicodeEastAsianWidth._binaryRangeSearch
  hasEm = unicodeEastAsianWidth.hasEm
  truncate = unicodeEastAsianWidth.truncate

  describe "East asian character width", ->
    it "can count hiragana", ->
      expect(width("こんにちわ")).toEqual 10
    it "can count kanji", ->
      expect(width("渋川喜規")).toEqual 8
    it "can count alphabet", ->
      expect(width("abcDEF123!$%")).toEqual 12
    it "can count unicode", ->
      expect(width("\u2026")).toEqual 2
    it "can count surrogate pair min", ->
      expect(width(String.fromCharCode(0xD800, 0xDC00))).toEqual 1
    it "can count surrogate pair max", ->
      expect(width(String.fromCharCode(0xDBFF, 0xDFFF))).toEqual 1
    it "can count surrogate pair width 4", ->
      expect(width(String.fromCharCode(0xD840, 0xDC0B) + String.fromCharCode(0xD869, 0xDEB2))).toEqual 4
    it "throw error when lower than surrogate pair", ->
      expect( ->
        width(String.fromCharCode(0xD800, 0xDBFF))
      ).toThrow(new Error("UTF-16 decode error"))
    it "throw error when higher than surrogate pair", ->
      expect( ->
        width(String.fromCharCode(0xDC00, 0xE000))
      ).toThrow(new Error("UTF-16 decode error"))
  describe "Binary range search", ->
    it "can match boundary", ->
      expect(binaryRangeSearch([1], [5], 1)).toBeTruthy()
    it "can match in range", ->
      expect(binaryRangeSearch([1], [5], 2)).toBeTruthy()
    it "can match in boundary2", ->
      expect(binaryRangeSearch([1, 5], [3, 7], 1)).toBeTruthy()
    it "can match in boundary3", ->
      expect(binaryRangeSearch([1, 5], [3, 7], 5)).toBeTruthy()
    it "can match in range2", ->
      expect(binaryRangeSearch([1, 5], [3, 7], 2)).toBeTruthy()
    it "can match in range3", ->
      expect(binaryRangeSearch([1, 5], [3, 7], 6)).toBeTruthy()
    it "can match in boundary4", ->
      expect(binaryRangeSearch([1, 5], [3, 7], 7)).toBeTruthy()
    it "can check value is out of range", ->
      expect(binaryRangeSearch([3], [5], 1)).toBeFalsy()
    it "can check value is out of range2", ->
      expect(binaryRangeSearch([1, 5], [3, 7], 0)).toBeFalsy()
    it "can check value is out of range3", ->
      expect(binaryRangeSearch([1, 5], [3, 7], 4)).toBeFalsy()
    it "can check value is out of range4", ->
      expect(binaryRangeSearch([1, 5], [3, 7], 8)).toBeFalsy()
  describe "tools", ->
    it "hasEm", ->
      expect(hasEm("DOUTOR 新宿アイランド店")).toEqual(true)
      expect(hasEm("DOUTOR")).toEqual(false)
      expect(hasEm("")).toEqual(false)
      expect(hasEm(String.fromCharCode(0xD800, 0xDC00))).toEqual false
    it "truncate", ->
      expect(truncate("DOUTOR 新宿アイランド店", 15, "...")).toEqual("DOUTOR 新宿...")
      expect(truncate("無印良品 アキバ・トリム", 20, "...")).toEqual("無印良品 アキバ・...")
      expect(truncate("VILLAGE VANGUARD 渋谷宇田川", 15, "...")).toEqual("VILLAGE VANG...")
      expect(truncate("VILLAGE VANGUARD 渋谷宇田川", 15, "...").length).toEqual(15)
      expect(truncate("Shinjuku", 15, "…")).toEqual("Shinjuku")
      expect(truncate("あいうえお", 12, "...")).toEqual("あいうえお")
      expect(truncate("あいうえお", 11, "...")).toEqual("あいうえお")
      expect(truncate("あいうえお", 10, "...")).toEqual("あいうえお")
      expect(truncate("あいうえお", 9, "...")).toEqual("あいう...")
      expect(truncate("あいうえお", 8, "...")).toEqual("あい...")
      expect(truncate("あいうえお", 7, "...")).toEqual("あい...")
      expect(truncate("あいうえお", 6, "...")).toEqual("あ...")
      expect(truncate("あいうえお", 5, "...")).toEqual("あ...")
