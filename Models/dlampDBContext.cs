namespace dlamp.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class dlampDBContext : DbContext
    {
        public dlampDBContext()
            : base("name=dlampDBContext")
        {
        }

        public virtual DbSet<TBL_BOOKS> TBL_BOOKS { get; set; }

        public virtual DbSet<TBL_EVENTS> TBL_EVENTS { get; set; }

        public virtual DbSet<TBL_ARTICLES_EXTERNAL> TBL_ARTICLES_EXTERNAL { get; set; }

        public virtual DbSet<TBL_COURSES> TBL_COURSES { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}
