using SSI360V2.Core.Entities;

namespace SSI360V2.Core.Interfaces;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetByTenantAsync(Guid tenantId);
    Task<IEnumerable<User>> GetByRoleAsync(Guid roleId);
}

public interface IRoleRepository : IRepository<Role>
{
    Task<IEnumerable<Role>> GetByTenantAsync(Guid tenantId);
    Task<Role?> GetByNameAsync(string name, Guid tenantId);
}

public interface ITenantRepository : IRepository<Tenant>
{
    Task<Tenant?> GetByDomainAsync(string domain);
}

public interface IPermissionRepository : IRepository<Permission>
{
    Task<IEnumerable<Permission>> GetByRoleAsync(Guid roleId);
}
