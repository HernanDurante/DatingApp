using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _ctx;

        public DatingRepository(DataContext ctx)
        {
            _ctx = ctx;

        }
        public void Add<T>(T entity) where T : class
        {
            _ctx.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _ctx.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _ctx.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Id == id);
            return user;
        }
        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _ctx.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();

            users = users.Where(x => x.Id != userParams.UserId);
            users = users.Where(x => x.Gender == userParams.Gender);
            
            if(userParams.Likers) 
            {
                var userLikers = await GetUserLikes(userParams.UserId, true);
                users = users.Where(u => userLikers.Contains(u.Id));
            }
            if(userParams.Likees) 
            {
                var userLikees = await GetUserLikes(userParams.UserId, false);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if(userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MinAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MaxAge);

                users = users.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);
            }

            if(!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<Photo> GetPhoto(int photoId)
        {
            var photo = await _ctx.Photos.FirstOrDefaultAsync(x => x.Id == photoId);
            return photo;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _ctx.Photos.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.IsMain);
        }
        public async Task<bool> SaveAll()
        {
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _ctx.Likes.FirstOrDefaultAsync(x => x.LikerId == userId && x.LikeeId == recipientId);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _ctx.Users
                .Include(x => x.Likers)
                .Include(x => x.Likees)
                .FirstOrDefaultAsync( u => u.Id == id);

            if(likers)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }    
            else
            {
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
        }
    }
}