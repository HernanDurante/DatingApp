namespace DatingApp.API.Models
{
    public class Like
    {
        public int LikerId { get; set; }
        public int LikeeId { get; set; }
        public User Liker { get; set; } //Many to Many
        public User Likee { get; set; } //Many to Many
    }
}