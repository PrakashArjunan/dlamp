using System;
using System.Linq;
using System.Web.Mvc;
using System.Diagnostics;
using dlamp.Models;
using System.IO;
using HtmlAgilityPack;
using System.Net; 

namespace dlamp.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        
        private dlampDBContext db = new dlampDBContext();
        [OutputCache(CacheProfile = "CacheOneHour")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult EventsConf()
        {
            return View();
        }

        public ActionResult Articles()
        {
            return View();
        }

        public ActionResult Books()
        {
            return View();
        }

        public ActionResult Dojo()
        {
            if (Request.QueryString["filter"] != null)
            {
                string filter = Request.QueryString["filter"].ToString();
                ViewBag.filter = filter;
            }
            else
            {
                ViewBag.filter = "All Courses";
            }
                
            
            return View();

        }

        public ActionResult NewJoinee()
        {
            return View();
        }


        //// Fetch Informations from DB Starts ========================================================= >

        // POST: Home/booksList (Fetches BooksList From DB)
        [HttpPost, ActionName("booksList")]
        public ActionResult BooksListFromDB()
        {
            try
            {
                return Json(db.TBL_BOOKS.OrderByDescending(e => e.ID).ToList());
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex);
                return null;
            }

        }

        // POST: Home/eventsList (Fetches EventsList From DB)
        [HttpPost, ActionName("eventsList")]
        public ActionResult EventsListFromDB()
        {
            try
            {
               return Json(db.TBL_EVENTS.ToList());
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex);
                return null;
            }

        }

        // POST: Home/booksList (Fetches ArticlesList From DB)
        [HttpPost, ActionName("articlesList")]
        public ActionResult ArticlesListFromDB()
        {
            try
            {
                return Json(db.TBL_ARTICLES_EXTERNAL.OrderByDescending(e => e.ID).ToList());
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex);
                return null;
            }

        }

        // POST: Home/booksList (Fetches ArticlesList From DB)
        [HttpPost, ActionName("coursesList")]
        public ActionResult CoursesListFromDB()
        {
            try
            { 

                return Json(db.TBL_COURSES.OrderByDescending(e => e.ID).ToList());
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex);
                return null;
            }

        }

        //// Fetch Informations from DB Ends ========================================================== >

        //// Send Information to DB Starts ============================================================ >

        // POST: Home/addBook
        [HttpPost, ActionName("addBook")]
        public ActionResult AddBook([Bind(Include = "ID,BK_Title,BK_Desc,BK_Author,BK_SharedBy,BK_Category,BK_CoverImg")] TBL_BOOKS bookData)
        {
            if (ModelState.IsValid)
            {
                db.TBL_BOOKS.Add(bookData);
                db.SaveChanges();
                return Json("success");
            }
            return Json("Add Book error");
        }

        // POST: Home/UpdateBook
        [HttpPost, ActionName("updateBook")]
        public ActionResult UpdateBook(TBL_BOOKS bookData)
        {
            if (ModelState.IsValid)
            {
                db.TBL_BOOKS.Attach(bookData);
                db.Entry(bookData).Property(e => e.BK_Title).IsModified = true;
                db.Entry(bookData).Property(e => e.BK_Desc).IsModified = true;
                db.Entry(bookData).Property(e => e.BK_Author).IsModified = true;
                db.Entry(bookData).Property(e => e.BK_SharedBy).IsModified = true;
                db.Entry(bookData).Property(e => e.BK_Category).IsModified = true;
                db.Entry(bookData).Property(e => e.BK_CoverImg).IsModified = true;
                db.SaveChanges();
                return Json("success");
            }

            return Json("Update Book error");
        }

        // POST: Home/removeBook
        [HttpPost, ActionName("removeBook")]
        public ActionResult RemoveBook(int id)
        {
            TBL_BOOKS bookinfo = db.TBL_BOOKS.Find(id);

            db.TBL_BOOKS.Remove(bookinfo);
            db.SaveChanges();
            return Json("Book Deleted Successfull");
        }

        //// Send Information to DB Ends ============================================================ >

        // POST: Home/profileimageupload
        [HttpPost, ActionName("uploadImage")]
        public ActionResult UploadImage()
        {
            var currentFile = Request.QueryString["fileName"];
            var file = Request.Files[0];
            var path = Path.Combine(Server.MapPath("~/Images/BookCovers/"), currentFile);
            file.SaveAs(path);

            return Json(" Image Uploaded");
        }




        /// <summary>
        /// Fetch Metadata Information from URL
        /// </summary>

        public class MetaData
        {
            public string Title { get; set; }
            public string Description { get; set; }
            public string ImgURL { get; set; }
            public string Author { get; set; }
            public string SiteName { get; set; }
        }

        [HttpPost, ActionName("metaDataURL")]
        public ActionResult MetaDataURL(string url)
        {

            if (url !=null)
            {
                HtmlWeb webGet = new HtmlWeb()
                {
                    PreRequest = request =>
                    {
                        request.AutomaticDecompression = DecompressionMethods.Deflate | DecompressionMethods.GZip;
                        return true;
                    }
                };
                webGet.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36";
                var document = webGet.Load(url);
                var metaTags = document.DocumentNode.SelectNodes(".//head/meta");

                if (metaTags != null)
                {

                    MetaData data = new MetaData();

                    foreach (var tag in metaTags)
                    {

                        if (tag.Attributes["property"] != null && tag.Attributes["content"] != null && tag.Attributes["property"].Value == "og:title")
                        {
                            data.Title = Server.HtmlDecode(tag.Attributes["content"].Value);
                        }

                        if (tag.Attributes["property"] != null && tag.Attributes["content"] != null && tag.Attributes["property"].Value == "og:description")
                        {
                            data.Description = Server.HtmlDecode(tag.Attributes["content"].Value);
                        }

                        if (tag.Attributes["property"] != null && tag.Attributes["content"] != null && tag.Attributes["property"].Value == "og:image")
                        {
                            data.ImgURL = Server.HtmlDecode(tag.Attributes["content"].Value);
                        }

                        if (tag.Attributes["property"] != null && tag.Attributes["content"] != null && tag.Attributes["property"].Value == "og:book:author")
                        {
                            data.Author = Server.HtmlDecode(tag.Attributes["content"].Value);
                        }

                        if (tag.Attributes["property"] != null && tag.Attributes["content"] != null && tag.Attributes["property"].Value == "og:site_name")
                        {
                            data.SiteName = Server.HtmlDecode(tag.Attributes["content"].Value);
                        }

                    }
                    return Json(data);

                }

            }
            return Json("peace");

        }

        // POST: Home/postBook
        [HttpPost, ActionName("postBook")]
        public ActionResult PostBook([Bind(Include = "ID,BK_Title,BK_Desc,BK_Author,BK_SharedBy,BK_Category,BK_CoverImg,BK_Type,BK_URL,BK_Source")] TBL_BOOKS bookData)
        {
            if (ModelState.IsValid)
            {
                db.TBL_BOOKS.Add(bookData);
                db.SaveChanges();
                return Json("success");
            }
            return Json("Add Book error");
        }

        // POST: Home/postArticle
        [HttpPost, ActionName("postArticle")]
        public ActionResult PostArticle([Bind(Include = "ID,AR_URL,AR_SharedBy,AR_Category")] TBL_ARTICLES_EXTERNAL articleData)
        {
            if (ModelState.IsValid)
            {
                db.TBL_ARTICLES_EXTERNAL.Add(articleData);
                db.SaveChanges();
                return Json("success");
            }
            return Json("Add Book error");
        }


        // POST: Home/postCourse
        [HttpPost, ActionName("postCourse")]
        public ActionResult PostCourse([Bind(Include = "ID,CR_URL,CR_SharedBy,CR_Category,CR_Type")] TBL_COURSES courseData)
        {
            if (ModelState.IsValid)
            {
                db.TBL_COURSES.Add(courseData);
                db.SaveChanges();
                return Json("success");
            }
            return Json("Add Book error");
        }

    }

}