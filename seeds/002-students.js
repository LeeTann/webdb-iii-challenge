
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {name: 'Leeroy', cohort_id: 1},
        {name: 'Rebster', cohort_id: 3},
        {name: 'Nuggets', cohort_id: 1}
      ]);
    });
};
