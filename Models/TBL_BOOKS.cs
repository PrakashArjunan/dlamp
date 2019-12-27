namespace dlamp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class TBL_BOOKS
    {
        public int ID { get; set; }

        public string BK_Title { get; set; }

        public string BK_Desc { get; set; }

        public string BK_Author { get; set; }

        public string BK_SharedBy { get; set; }

        public string BK_Category { get; set; }

        public string BK_CoverImg { get; set; }

        public string BK_Type { get; set; }

        public string BK_URL { get; set; }

        public string BK_Source { get; set; }

        
    }
}
