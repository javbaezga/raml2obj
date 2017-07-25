<a name="5.0.1"></a>
## [5.0.1](https://github.com/raml2html/raml2obj/compare/4.0.0...v5.0.1) (2017-07-25)


### Breaking

* A lot of changes in the main script. Removed unique ID, absoluteUrl (parser is adding absoluteUri now) and added security schemes ([8a217e23cef5f421fa422be9f197743577d7f22e](https://github.com/raml2html/raml2obj/commit/8a217e23cef5f421fa422be9f197743577d7f22e))
* It now tranforms objects from properties / items to array ([bcc8b2e4d73960d85980bba8b9b3c730f9b0ea15](https://github.com/raml2html/raml2obj/commit/bcc8b2e4d73960d85980bba8b9b3c730f9b0ea15))

### Fix

* Added default options object. ([9f8deeb66032eca5a6d6d088a019ae6ae69f1f74](https://github.com/raml2html/raml2obj/commit/9f8deeb66032eca5a6d6d088a019ae6ae69f1f74))
* Fixed issue with a self property recognition in node ([bb493d2aac581e8130bbad3859b2e81389b975db](https://github.com/raml2html/raml2obj/commit/bb493d2aac581e8130bbad3859b2e81389b975db))
* Fixed reference to the window object. The library is meant to work in web worker. ([61621c23181174dc0d19efb52c8e385bf15d00a6](https://github.com/raml2html/raml2obj/commit/61621c23181174dc0d19efb52c8e385bf15d00a6))
* Fixed security schemas object assignment. Now it creates copy of the base object so changes to the object won't reflec in changes to other objects ([75e65dfe6d2866669342297074cc7e2a30de0f0d](https://github.com/raml2html/raml2obj/commit/75e65dfe6d2866669342297074cc7e2a30de0f0d))
* Fixed types recognition. ([e8a42b368251584bb2e74f6c16d7484b5ab894a7](https://github.com/raml2html/raml2obj/commit/e8a42b368251584bb2e74f6c16d7484b5ab894a7))
* Fixed web worker env recognition. ([f22f721fce0a982d37ef3b2caa9b3db2c37b37b7](https://github.com/raml2html/raml2obj/commit/f22f721fce0a982d37ef3b2caa9b3db2c37b37b7))
* Fixing recursive types error. ([11acd1e8c3c852351b54ba416bb69ff2809541ed](https://github.com/raml2html/raml2obj/commit/11acd1e8c3c852351b54ba416bb69ff2809541ed))

### New

* Adding more test <3 ([531c9c7aa4024290f1eaa6865e60f15793f1af7e](https://github.com/raml2html/raml2obj/commit/531c9c7aa4024290f1eaa6865e60f15793f1af7e))
* Build with fixed type error ([332108c32398810977e3b04791561fd32c02b10b](https://github.com/raml2html/raml2obj/commit/332108c32398810977e3b04791561fd32c02b10b))
* Complete redesign of the library. Exposes more function. ([747881dc3f9cbcfaedd8a970671531536037e98b](https://github.com/raml2html/raml2obj/commit/747881dc3f9cbcfaedd8a970671531536037e98b))
* Made the script work as a web worker ([674da5dbb5c108d0e3776c0fe5f7093ca8d8844d](https://github.com/raml2html/raml2obj/commit/674da5dbb5c108d0e3776c0fe5f7093ca8d8844d))

### Update

* Added one more test case to test if it's working. ([3552711321fcc7dcd67f2f5f35d08472f407ae4d](https://github.com/raml2html/raml2obj/commit/3552711321fcc7dcd67f2f5f35d08472f407ae4d))
* added performance API to test library performance ([50cfd0f76b290d7b4972c2cc4de61e42026985aa](https://github.com/raml2html/raml2obj/commit/50cfd0f76b290d7b4972c2cc4de61e42026985aa))
* Build the script ([e533e55fb24bf4da5278c924b0c84448d1f88a2f](https://github.com/raml2html/raml2obj/commit/e533e55fb24bf4da5278c924b0c84448d1f88a2f))
* Bumped version after breaking API change ([eeb33f9aee0547527c041073ae14699dfdaf86c9](https://github.com/raml2html/raml2obj/commit/eeb33f9aee0547527c041073ae14699dfdaf86c9))
* Consistency helper will not override inline properties anymore ([45b0405e03418301f81dbca68f8e5d820196f610](https://github.com/raml2html/raml2obj/commit/45b0405e03418301f81dbca68f8e5d820196f610))
* Fixed method that applied security schemes. Now it will apply oauth 2 settings specified for a particular method ([4ff007dcf4c807b76670f948887fa01896e7858c](https://github.com/raml2html/raml2obj/commit/4ff007dcf4c807b76670f948887fa01896e7858c))
* Ignoring build files. They should be generated in dev environment. ([c3bd8da6d0e358f8553c02aec3eb3d43b552aa93](https://github.com/raml2html/raml2obj/commit/c3bd8da6d0e358f8553c02aec3eb3d43b552aa93))
* Ignorning test/*.json files. ([86f1125040e4d07a6dbd774b24448a3ceafbd1c2](https://github.com/raml2html/raml2obj/commit/86f1125040e4d07a6dbd774b24448a3ceafbd1c2))
* Made the interface async based on Promises ([4bcc67975d2bad16dcf518785145cd297cd028bc](https://github.com/raml2html/raml2obj/commit/4bcc67975d2bad16dcf518785145cd297cd028bc))
* PRohibits object examples list to be overriten by types objects list. ([f29e862d222fc938653292630187a54338efcb38](https://github.com/raml2html/raml2obj/commit/f29e862d222fc938653292630187a54338efcb38))
* Removed analyzer to reduce code size in browser version. ([e500571a566808a478a1815e1baf08513a369050](https://github.com/raml2html/raml2obj/commit/e500571a566808a478a1815e1baf08513a369050))
* Removed debugger statement. ([f611aaa631ee39513ca70aa80f78dcb13b7c97d1](https://github.com/raml2html/raml2obj/commit/f611aaa631ee39513ca70aa80f78dcb13b7c97d1))
* Updated build command for the browser version ([b93d5f7ad368520c9241304ac107bfad06b1343c](https://github.com/raml2html/raml2obj/commit/b93d5f7ad368520c9241304ac107bfad06b1343c))
* Updated files list in the package.json file ([5557aa28ac378939ede2081e3ae6f372a845d8fb](https://github.com/raml2html/raml2obj/commit/5557aa28ac378939ede2081e3ae6f372a845d8fb))
* Updated gitignore for new architecture ([c33ce34120c0fe36c43dcb1a284efd4d1b7c829a](https://github.com/raml2html/raml2obj/commit/c33ce34120c0fe36c43dcb1a284efd4d1b7c829a))
* Updated readme file. ([4dfa83ae6408cfbcf2b8d917084519be3f656b90](https://github.com/raml2html/raml2obj/commit/4dfa83ae6408cfbcf2b8d917084519be3f656b90))
* Updated test configuration. ([b6644182293ea8044c1efd23b80dbae414eb8895](https://github.com/raml2html/raml2obj/commit/b6644182293ea8044c1efd23b80dbae414eb8895))
* Updated tests for new API. ([61404b5f69eb513aff4257d8877ceebd12e63ccd](https://github.com/raml2html/raml2obj/commit/61404b5f69eb513aff4257d8877ceebd12e63ccd))
* Updated Travis configuration to connect to Sauce Labs. ([82aa2631c723a092c79b919ddaff4cd40cc279dc](https://github.com/raml2html/raml2obj/commit/82aa2631c723a092c79b919ddaff4cd40cc279dc))



<a name="5.0.0"></a>
# [5.0.0](https://github.com/raml2html/raml2obj/compare/4.0.0...v5.0.0) (2017-07-20)


### Breaking

* A lot of changes in the main script. Removed unique ID, absoluteUrl (parser is adding absoluteUri now) and added security schemes ([8a217e23cef5f421fa422be9f197743577d7f22e](https://github.com/raml2html/raml2obj/commit/8a217e23cef5f421fa422be9f197743577d7f22e))
* It now tranforms objects from properties / items to array ([bcc8b2e4d73960d85980bba8b9b3c730f9b0ea15](https://github.com/raml2html/raml2obj/commit/bcc8b2e4d73960d85980bba8b9b3c730f9b0ea15))

### Fix

* Fixed reference to the window object. The library is meant to work in web worker. ([61621c23181174dc0d19efb52c8e385bf15d00a6](https://github.com/raml2html/raml2obj/commit/61621c23181174dc0d19efb52c8e385bf15d00a6))
* Fixed security schemas object assignment. Now it creates copy of the base object so changes to the object won't reflec in changes to other objects ([75e65dfe6d2866669342297074cc7e2a30de0f0d](https://github.com/raml2html/raml2obj/commit/75e65dfe6d2866669342297074cc7e2a30de0f0d))
* Fixing recursive types error. ([11acd1e8c3c852351b54ba416bb69ff2809541ed](https://github.com/raml2html/raml2obj/commit/11acd1e8c3c852351b54ba416bb69ff2809541ed))

### New

* Adding more test <3 ([531c9c7aa4024290f1eaa6865e60f15793f1af7e](https://github.com/raml2html/raml2obj/commit/531c9c7aa4024290f1eaa6865e60f15793f1af7e))
* Build with fixed type error ([332108c32398810977e3b04791561fd32c02b10b](https://github.com/raml2html/raml2obj/commit/332108c32398810977e3b04791561fd32c02b10b))
* Complete redesign of the library. Exposes more function. ([747881dc3f9cbcfaedd8a970671531536037e98b](https://github.com/raml2html/raml2obj/commit/747881dc3f9cbcfaedd8a970671531536037e98b))
* Made the script work as a web worker ([674da5dbb5c108d0e3776c0fe5f7093ca8d8844d](https://github.com/raml2html/raml2obj/commit/674da5dbb5c108d0e3776c0fe5f7093ca8d8844d))

### Update

* added performance API to test library performance ([50cfd0f76b290d7b4972c2cc4de61e42026985aa](https://github.com/raml2html/raml2obj/commit/50cfd0f76b290d7b4972c2cc4de61e42026985aa))
* Build the script ([e533e55fb24bf4da5278c924b0c84448d1f88a2f](https://github.com/raml2html/raml2obj/commit/e533e55fb24bf4da5278c924b0c84448d1f88a2f))
* Bumped version after breaking API change ([eeb33f9aee0547527c041073ae14699dfdaf86c9](https://github.com/raml2html/raml2obj/commit/eeb33f9aee0547527c041073ae14699dfdaf86c9))
* Consistency helper will not override inline properties anymore ([45b0405e03418301f81dbca68f8e5d820196f610](https://github.com/raml2html/raml2obj/commit/45b0405e03418301f81dbca68f8e5d820196f610))
* Fixed method that applied security schemes. Now it will apply oauth 2 settings specified for a particular method ([4ff007dcf4c807b76670f948887fa01896e7858c](https://github.com/raml2html/raml2obj/commit/4ff007dcf4c807b76670f948887fa01896e7858c))
* Ignoring build files. They should be generated in dev environment. ([c3bd8da6d0e358f8553c02aec3eb3d43b552aa93](https://github.com/raml2html/raml2obj/commit/c3bd8da6d0e358f8553c02aec3eb3d43b552aa93))
* Ignorning test/*.json files. ([86f1125040e4d07a6dbd774b24448a3ceafbd1c2](https://github.com/raml2html/raml2obj/commit/86f1125040e4d07a6dbd774b24448a3ceafbd1c2))
* Made the interface async based on Promises ([4bcc67975d2bad16dcf518785145cd297cd028bc](https://github.com/raml2html/raml2obj/commit/4bcc67975d2bad16dcf518785145cd297cd028bc))
* PRohibits object examples list to be overriten by types objects list. ([f29e862d222fc938653292630187a54338efcb38](https://github.com/raml2html/raml2obj/commit/f29e862d222fc938653292630187a54338efcb38))
* Updated build command for the browser version ([b93d5f7ad368520c9241304ac107bfad06b1343c](https://github.com/raml2html/raml2obj/commit/b93d5f7ad368520c9241304ac107bfad06b1343c))
* Updated gitignore for new architecture ([c33ce34120c0fe36c43dcb1a284efd4d1b7c829a](https://github.com/raml2html/raml2obj/commit/c33ce34120c0fe36c43dcb1a284efd4d1b7c829a))
* Updated readme file. ([4dfa83ae6408cfbcf2b8d917084519be3f656b90](https://github.com/raml2html/raml2obj/commit/4dfa83ae6408cfbcf2b8d917084519be3f656b90))
* Updated test configuration. ([b6644182293ea8044c1efd23b80dbae414eb8895](https://github.com/raml2html/raml2obj/commit/b6644182293ea8044c1efd23b80dbae414eb8895))
* Updated tests for new API. ([61404b5f69eb513aff4257d8877ceebd12e63ccd](https://github.com/raml2html/raml2obj/commit/61404b5f69eb513aff4257d8877ceebd12e63ccd))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/raml2html/raml2obj/compare/4.0.0...v4.0.0) (2017-07-20)


### Breaking

* A lot of changes in the main script. Removed unique ID, absoluteUrl (parser is adding absoluteUri now) and added security schemes ([8a217e23cef5f421fa422be9f197743577d7f22e](https://github.com/raml2html/raml2obj/commit/8a217e23cef5f421fa422be9f197743577d7f22e))

### Fix

* Fixed reference to the window object. The library is meant to work in web worker. ([61621c23181174dc0d19efb52c8e385bf15d00a6](https://github.com/raml2html/raml2obj/commit/61621c23181174dc0d19efb52c8e385bf15d00a6))
* Fixed security schemas object assignment. Now it creates copy of the base object so changes to the object won't reflec in changes to other objects ([75e65dfe6d2866669342297074cc7e2a30de0f0d](https://github.com/raml2html/raml2obj/commit/75e65dfe6d2866669342297074cc7e2a30de0f0d))
* Fixing recursive types error. ([11acd1e8c3c852351b54ba416bb69ff2809541ed](https://github.com/raml2html/raml2obj/commit/11acd1e8c3c852351b54ba416bb69ff2809541ed))

### New

* Adding more test <3 ([531c9c7aa4024290f1eaa6865e60f15793f1af7e](https://github.com/raml2html/raml2obj/commit/531c9c7aa4024290f1eaa6865e60f15793f1af7e))
* Build with fixed type error ([332108c32398810977e3b04791561fd32c02b10b](https://github.com/raml2html/raml2obj/commit/332108c32398810977e3b04791561fd32c02b10b))
* Complete redesign of the library. Exposes more function. ([747881dc3f9cbcfaedd8a970671531536037e98b](https://github.com/raml2html/raml2obj/commit/747881dc3f9cbcfaedd8a970671531536037e98b))
* Made the script work as a web worker ([674da5dbb5c108d0e3776c0fe5f7093ca8d8844d](https://github.com/raml2html/raml2obj/commit/674da5dbb5c108d0e3776c0fe5f7093ca8d8844d))

### Update

* added performance API to test library performance ([50cfd0f76b290d7b4972c2cc4de61e42026985aa](https://github.com/raml2html/raml2obj/commit/50cfd0f76b290d7b4972c2cc4de61e42026985aa))
* Build the script ([e533e55fb24bf4da5278c924b0c84448d1f88a2f](https://github.com/raml2html/raml2obj/commit/e533e55fb24bf4da5278c924b0c84448d1f88a2f))
* Consistency helper will not override inline properties anymore ([45b0405e03418301f81dbca68f8e5d820196f610](https://github.com/raml2html/raml2obj/commit/45b0405e03418301f81dbca68f8e5d820196f610))
* Fixed method that applied security schemes. Now it will apply oauth 2 settings specified for a particular method ([4ff007dcf4c807b76670f948887fa01896e7858c](https://github.com/raml2html/raml2obj/commit/4ff007dcf4c807b76670f948887fa01896e7858c))
* Ignoring build files. They should be generated in dev environment. ([c3bd8da6d0e358f8553c02aec3eb3d43b552aa93](https://github.com/raml2html/raml2obj/commit/c3bd8da6d0e358f8553c02aec3eb3d43b552aa93))
* Ignorning test/*.json files. ([86f1125040e4d07a6dbd774b24448a3ceafbd1c2](https://github.com/raml2html/raml2obj/commit/86f1125040e4d07a6dbd774b24448a3ceafbd1c2))
* Made the interface async based on Promises ([4bcc67975d2bad16dcf518785145cd297cd028bc](https://github.com/raml2html/raml2obj/commit/4bcc67975d2bad16dcf518785145cd297cd028bc))
* PRohibits object examples list to be overriten by types objects list. ([f29e862d222fc938653292630187a54338efcb38](https://github.com/raml2html/raml2obj/commit/f29e862d222fc938653292630187a54338efcb38))
* Updated build command for the browser version ([b93d5f7ad368520c9241304ac107bfad06b1343c](https://github.com/raml2html/raml2obj/commit/b93d5f7ad368520c9241304ac107bfad06b1343c))
* Updated gitignore for new architecture ([c33ce34120c0fe36c43dcb1a284efd4d1b7c829a](https://github.com/raml2html/raml2obj/commit/c33ce34120c0fe36c43dcb1a284efd4d1b7c829a))
* Updated readme file. ([4dfa83ae6408cfbcf2b8d917084519be3f656b90](https://github.com/raml2html/raml2obj/commit/4dfa83ae6408cfbcf2b8d917084519be3f656b90))
* Updated test configuration. ([b6644182293ea8044c1efd23b80dbae414eb8895](https://github.com/raml2html/raml2obj/commit/b6644182293ea8044c1efd23b80dbae414eb8895))
