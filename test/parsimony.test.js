describe('Parismony Test', function() {
  beforeEach(module('TreeServices'));
  
  // Factory of interest is called MyFactory
  describe('TreeModel Test', function() {
    var TreeModel = null;
    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            TreeModel = $injector.get('ParsimonyModel');
        });


    });

   

    it('Sets length should be 4', function() {
      var sets = TreeModel.makeSet();
      expect(sets.length).toEqual(4);
    });

    it('Info Sets should have 3 sets ', function() {
      var sets = TreeModel.makeSet();
      var info_set = TreeModel.getInfoSet(sets);
      var keys_length = Object.keys(info_set).length;

      expect(keys_length).toEqual(3);

    });

    it('Check Tree scores on given sets', function() {
        spyOn(TreeModel, 'makeSet').and.returnValue([
            {"title" : 'Human', "DNA" : 'CTGGCC'},
            {"title" : 'Dog', "DNA" : 'CTAGCC'},
            {"title" : 'Mushroom', "DNA" : 'CTGGAG'},
            {"title" : 'Tulip', "DNA" : 'TTAGAG'}
            ]);
        var sets = TreeModel.makeSet();
         var info_sets = TreeModel.getInfoSet(sets);
         var scores = TreeModel.getTreeScores(info_sets);

          expect(scores.length).toEqual(3);
          expect(scores[0]).toEqual([2,1,1]);
          expect(scores[1]).toEqual([1,2,2]);
          expect(scores[2]).toEqual([2,2,2]);
    });

    
  });
});